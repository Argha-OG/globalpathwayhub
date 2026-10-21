const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

function hashPassword(password, salt = 'gph_secure_salt_2026') {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

async function runMigration() {
  console.log('Connecting to Neon database for full schema migration...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected! Creating enterprise tables...');

    await client.query(`
      -- Users table (Admins, Agents, Accountants)
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'agent',
        phone TEXT,
        branch TEXT DEFAULT 'Dhaka Corporate Office',
        commission_rate NUMERIC DEFAULT 15.0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Students File Management table
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        student_code TEXT UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date_of_birth DATE,
        nationality TEXT DEFAULT 'Bangladeshi',
        passport_number TEXT,
        highest_education TEXT,
        gpa TEXT,
        english_test TEXT DEFAULT 'IELTS',
        english_score TEXT,
        target_country TEXT,
        target_university TEXT,
        target_course TEXT,
        target_intake TEXT,
        status TEXT DEFAULT 'counseling',
        assigned_agent_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Student Documents Vault (Cloudflare R2)
      CREATE TABLE IF NOT EXISTS student_documents (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        document_type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        r2_key TEXT,
        file_size TEXT,
        status TEXT DEFAULT 'verified',
        notes TEXT,
        uploaded_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Leads CRM table
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        city TEXT,
        preferred_country TEXT,
        preferred_degree TEXT,
        lead_source TEXT DEFAULT 'facebook_ads',
        status TEXT DEFAULT 'new',
        priority TEXT DEFAULT 'high',
        assigned_agent_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        estimated_commission NUMERIC DEFAULT 1500.00,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Operational & Marketing Cost Ledger
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        expense_date DATE DEFAULT CURRENT_DATE,
        paid_to TEXT,
        payment_method TEXT DEFAULT 'bank_transfer',
        receipt_url TEXT,
        notes TEXT,
        recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Revenue & Invoices table
      CREATE TABLE IF NOT EXISTS revenues (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        total_amount NUMERIC(12, 2) NOT NULL,
        net_company_amount NUMERIC(12, 2) NOT NULL,
        agent_commission_amount NUMERIC(12, 2) DEFAULT 0.00,
        currency TEXT DEFAULT 'USD',
        student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
        agent_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        status TEXT DEFAULT 'received',
        payment_date DATE DEFAULT CURRENT_DATE,
        payment_method TEXT DEFAULT 'wire_transfer',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Agent Commission Payouts
      CREATE TABLE IF NOT EXISTS agent_payouts (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        revenue_id TEXT REFERENCES revenues(id) ON DELETE SET NULL,
        student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
        amount NUMERIC(12, 2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'paid',
        payout_date DATE DEFAULT CURRENT_DATE,
        payment_reference TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Web Visitors & Attribution Tracker
      CREATE TABLE IF NOT EXISTS visitors (
        id TEXT PRIMARY KEY,
        ip_hash TEXT,
        path TEXT NOT NULL,
        referrer TEXT,
        country TEXT DEFAULT 'Bangladesh',
        city TEXT DEFAULT 'Dhaka',
        device TEXT DEFAULT 'Desktop',
        utm_source TEXT DEFAULT 'direct',
        utm_medium TEXT,
        utm_campaign TEXT,
        visited_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Indexes for High Performance
      CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
      CREATE INDEX IF NOT EXISTS idx_students_assigned_agent ON students(assigned_agent_id);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
      CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(payment_date);
      CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);
    `);

    console.log('Tables and indexes created successfully!');

    // Check if admin user exists, if not seed initial accounts
    const adminCheck = await client.query(`SELECT id FROM users WHERE email = 'admin@globalpathwayhub.com'`);
    let adminId = 'usr_admin_001';
    let agent1Id = 'usr_agent_001';
    let agent2Id = 'usr_agent_002';

    if (adminCheck.rows.length === 0) {
      console.log('Seeding administrative and counselor accounts...');
      const adminPass = hashPassword('Admin@GPH2026!');
      const agentPass = hashPassword('Agent@GPH2026!');

      await client.query(`
        INSERT INTO users (id, name, email, password_hash, role, phone, branch, commission_rate, status)
        VALUES 
          ($1, 'Managing Director (Admin)', 'admin@globalpathwayhub.com', $2, 'admin', '+880 1410-555054', 'Dhaka Head Office', 0.0, 'active'),
          ($3, 'Tanvir Ahmed', 'tanvir@globalpathwayhub.com', $4, 'agent', '+880 1711-223344', 'Dhaka Banani Branch', 15.0, 'active'),
          ($5, 'Nusrat Jahan', 'nusrat@globalpathwayhub.com', $4, 'agent', '+880 1819-556677', 'Chittagong GEC Branch', 18.0, 'active')
        ON CONFLICT (email) DO NOTHING;
      `, [adminId, adminPass, agent1Id, agentPass, agent2Id]);
    } else {
      adminId = adminCheck.rows[0].id;
    }

    // Seed realistic Student Files if table is empty
    const studentsCheck = await client.query(`SELECT count(*) FROM students`);
    if (parseInt(studentsCheck.rows[0].count) === 0) {
      console.log('Seeding initial student dossiers...');
      await client.query(`
        INSERT INTO students (id, student_code, full_name, email, phone, date_of_birth, passport_number, highest_education, gpa, english_test, english_score, target_country, target_university, target_course, target_intake, status, assigned_agent_id, notes)
        VALUES
          ('stu_001', 'GPH-2026-0101', 'Arifur Rahman Chowdhury', 'arifur.rahman@example.com', '+880 1712-345678', '2001-05-14', 'A02948192', 'B.Sc in Computer Science', '3.82', 'IELTS', '7.5', 'United Kingdom', 'University of Manchester', 'M.Sc Data Science & AI', 'September 2026', 'visa_approved', $1, 'CAS issued, UK Student Visa stamped. Flight booked for Sept 12.'),
          ('stu_002', 'GPH-2026-0102', 'Farzana Akter Ritu', 'farzana.ritu@example.com', '+880 1819-456789', '2002-11-20', 'A09823145', 'HSC Science', '5.00', 'IELTS', '6.5', 'Canada', 'University of Toronto', 'Bachelor of Computer Science', 'Fall 2026', 'unconditional_offer', $1, 'PAL received. Preparing GIC and study permit application documents.'),
          ('stu_003', 'GPH-2026-0103', 'Mahmudul Hasan Shuvo', 'mahmud.shuvo@example.com', '+880 1912-789012', '2000-08-03', 'B12456789', 'BBA in Finance', '3.65', 'PTE', '68', 'Australia', 'University of Melbourne', 'Master of International Business', 'February 2027', 'conditional_offer', $2, 'Pending final semester transcript submission.'),
          ('stu_004', 'GPH-2026-0104', 'Nabila Tabassum', 'nabila.t@example.com', '+880 1611-334455', '2003-02-18', 'A77665544', 'A-Levels', '3 A*s', 'IELTS', '8.0', 'United States', 'Arizona State University', 'B.Sc Software Engineering', 'Fall 2026', 'applied', $2, 'Application submitted with $15,000 New American University scholarship request.'),
          ('stu_005', 'GPH-2026-0105', 'Zubair Hossain', 'zubair.h@example.com', '+880 1515-998877', '2001-09-25', 'B88990011', 'B.Sc Electrical Eng', '3.50', 'IELTS', '6.5', 'United Kingdom', 'University of Birmingham', 'M.Sc Advanced Robotics', 'September 2026', 'documents_pending', $1, 'Awaiting bank solvency statement and updated SOP.')
        ON CONFLICT DO NOTHING;
      `, [agent1Id, agent2Id]);

      // Seed Student Documents
      await client.query(`
        INSERT INTO student_documents (id, student_id, title, document_type, file_url, file_size, status)
        VALUES
          ('doc_001', 'stu_001', 'Passport Bio Page Scan', 'passport', 'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/students/stu_001/passport.pdf', '2.4 MB', 'verified'),
          ('doc_002', 'stu_001', 'IELTS Official Test Report', 'ielts', 'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/students/stu_001/ielts_trf.pdf', '1.1 MB', 'verified'),
          ('doc_003', 'stu_001', 'University CAS Statement', 'cas_i20', 'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/students/stu_001/cas_statement.pdf', '850 KB', 'verified'),
          ('doc_004', 'stu_002', 'Passport & National ID', 'passport', 'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/students/stu_002/passport.pdf', '3.0 MB', 'verified'),
          ('doc_005', 'stu_002', 'Official Offer of Admission', 'offer_letter', 'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/students/stu_002/offer_letter.pdf', '1.6 MB', 'verified')
        ON CONFLICT DO NOTHING;
      `);
    }

    // Seed Leads CRM if empty
    const leadsCheck = await client.query(`SELECT count(*) FROM leads`);
    if (parseInt(leadsCheck.rows[0].count) === 0) {
      console.log('Seeding initial leads...');
      await client.query(`
        INSERT INTO leads (id, full_name, email, phone, city, preferred_country, preferred_degree, lead_source, status, priority, assigned_agent_id, estimated_commission, notes)
        VALUES
          ('lead_001', 'Sadia Islam Mim', 'sadia.mim@example.com', '+880 1700-112233', 'Dhaka', 'United Kingdom', 'Masters in Cybersecurity', 'facebook_ads', 'counseling_scheduled', 'high', $1, 2200.00, 'Clicked UK September Intake Meta Ad campaign. Scheduled in-person session this Thursday.'),
          ('lead_002', 'Kazi Rakibul Hasan', 'rakib.kazi@example.com', '+880 1822-334455', 'Sylhet', 'United States', 'Undergrad in Business', 'google_search', 'new', 'high', $2, 3000.00, 'Form submission on Website. Wants scholarship guidance.'),
          ('lead_003', 'Tasneem Anika', 'tasneem.a@example.com', '+880 1933-445566', 'Chittagong', 'Canada', 'Post Graduate Diploma in AI', 'facebook_ads', 'contacted', 'medium', $2, 1800.00, 'Contacted via WhatsApp, requested document checklist for Canadian SDS.'),
          ('lead_004', 'Shahadat Hossain', 'shahadat.h@example.com', '+880 1644-556677', 'Dhaka', 'Australia', 'Master of Civil Engineering', 'walk_in', 'documents_pending', 'high', $1, 2500.00, 'Walked into Banani office. Very strong profile with 3 years work experience.'),
          ('lead_005', 'Nafis Imtiaz', 'nafis.imtiaz@example.com', '+880 1555-667788', 'Rajshahi', 'Germany / Europe', 'M.Sc Mechanical Eng', 'website_inquiry', 'new', 'medium', $1, 1400.00, 'Inquired about public universities in Germany.')
        ON CONFLICT DO NOTHING;
      `, [agent1Id, agent2Id]);
    }

    // Seed Operational & Marketing Costs if empty
    const expenseCheck = await client.query(`SELECT count(*) FROM expenses`);
    if (parseInt(expenseCheck.rows[0].count) === 0) {
      console.log('Seeding financial cost ledger...');
      await client.query(`
        INSERT INTO expenses (id, title, category, amount, currency, expense_date, paid_to, payment_method, notes)
        VALUES
          ('exp_001', 'Meta Ads Campaign - Fall 2026 Intake Lead Generation', 'marketing_meta', 1450.00, 'USD', '2026-10-15', 'Meta Platforms Ireland', 'credit_card', 'Targeted Bangladesh STEM and Business graduates with IELTS 6.5+'),
          ('exp_002', 'Google Search Ads - "Study in UK Agency Dhaka"', 'marketing_google', 820.00, 'USD', '2026-10-18', 'Google Asia Pacific', 'credit_card', 'High-intent search campaign for university admissions'),
          ('exp_003', 'Banani Corporate Office Monthly Rent & Utilities', 'daily_office', 1250.00, 'USD', '2026-10-01', 'Property Landlord Ltd', 'bank_transfer', 'Dhaka main counseling center rent'),
          ('exp_004', 'Counselor Incentive & Performance Bonus (September)', 'salaries', 900.00, 'USD', '2026-10-05', 'Agent Team Pool', 'bank_transfer', 'Bonus for meeting student visa success milestone'),
          ('exp_005', 'Cloudflare Enterprise, Neon Postgres & CRM Software', 'software_saas', 180.00, 'USD', '2026-10-10', 'Cloud Providers', 'credit_card', 'R2 Storage, DB compute & domain infrastructure'),
          ('exp_006', 'Hotel Westin UK Education Expo Stall Sponsorship', 'event_expo', 2200.00, 'USD', '2026-10-08', 'Dhaka Expo Organizers', 'bank_transfer', 'Exclusive booth with 250+ student footfall')
        ON CONFLICT DO NOTHING;
      `);
    }

    // Seed Revenue & Invoices if empty
    const revenueCheck = await client.query(`SELECT count(*) FROM revenues`);
    if (parseInt(revenueCheck.rows[0].count) === 0) {
      console.log('Seeding revenue records & commission splits...');
      await client.query(`
        INSERT INTO revenues (id, invoice_number, title, category, total_amount, net_company_amount, agent_commission_amount, currency, student_id, agent_id, status, payment_date, payment_method, notes)
        VALUES
          ('rev_001', 'INV-2026-0081', 'University of Manchester - 15% First Year Tuition Commission (Arifur Rahman)', 'university_commission', 4800.00, 4080.00, 720.00, 'USD', 'stu_001', $1, 'received', '2026-10-12', 'wire_transfer', 'Full commission received post student visa arrival and university registration.'),
          ('rev_002', 'INV-2026-0082', 'University of Toronto - Enrolment Partner Commission (Farzana Akter)', 'university_commission', 5200.00, 4420.00, 780.00, 'USD', 'stu_002', $1, 'received', '2026-10-14', 'wire_transfer', 'First semester commission cleared via Flywire.'),
          ('rev_003', 'INV-2026-0083', 'Student Premium File Processing & Visa Advisory Fee (Mahmudul Hasan)', 'student_service_fee', 650.00, 552.50, 97.50, 'USD', 'stu_003', $2, 'received', '2026-10-16', 'bank_transfer', 'VIP counseling and embassy interview prep package.'),
          ('rev_004', 'INV-2026-0084', 'Arizona State University Application & Courier Processing Fee', 'student_service_fee', 400.00, 340.00, 60.00, 'USD', 'stu_004', $2, 'received', '2026-10-19', 'bank_transfer', 'Express document translation & courier handling.')
        ON CONFLICT DO NOTHING;
      `, [agent1Id, agent2Id]);

      // Seed Agent Payouts
      await client.query(`
        INSERT INTO agent_payouts (id, agent_id, revenue_id, student_id, amount, currency, status, payout_date, payment_reference, notes)
        VALUES
          ('pay_001', $1, 'rev_001', 'stu_001', 720.00, 'USD', 'paid', '2026-10-14', 'TXN-BK-992144', '15% commission paid out to Tanvir Ahmed for UK visa approval'),
          ('pay_002', $1, 'rev_002', 'stu_002', 780.00, 'USD', 'approved', '2026-10-25', 'PENDING-BATCH-OCT', 'Approved for month-end payroll wire'),
          ('pay_003', $2, 'rev_003', 'stu_003', 97.50, 'USD', 'paid', '2026-10-18', 'TXN-BK-993188', 'Commission on VIP student file processing')
        ON CONFLICT DO NOTHING;
      `, [agent1Id, agent2Id]);
    }

    // Seed Visitor Tracking data if empty
    const visitorCheck = await client.query(`SELECT count(*) FROM visitors`);
    if (parseInt(visitorCheck.rows[0].count) === 0) {
      console.log('Seeding visitor traffic metrics...');
      await client.query(`
        INSERT INTO visitors (id, ip_hash, path, referrer, country, city, device, utm_source, utm_medium, utm_campaign)
        VALUES
          ('vis_001', 'hash_a1', '/', 'https://www.facebook.com/', 'Bangladesh', 'Dhaka', 'Mobile', 'facebook', 'cpc', 'uk_fall2026'),
          ('vis_002', 'hash_a2', '/universities', 'https://www.google.com/', 'Bangladesh', 'Chittagong', 'Desktop', 'google', 'organic', NULL),
          ('vis_003', 'hash_a3', '/about', 'https://www.facebook.com/', 'Bangladesh', 'Sylhet', 'Mobile', 'facebook', 'social', 'brand_awareness'),
          ('vis_004', 'hash_a4', '/contact', 'https://x.com/GlobalPathwayHub', 'Bangladesh', 'Dhaka', 'Desktop', 'x', 'social', NULL),
          ('vis_005', 'hash_a5', '/universities', 'https://www.google.com/', 'Bangladesh', 'Dhaka', 'Desktop', 'google', 'cpc', 'study_abroad_bangladesh'),
          ('vis_006', 'hash_a6', '/', 'direct', 'Bangladesh', 'Dhaka', 'Desktop', 'direct', NULL, NULL),
          ('vis_007', 'hash_a7', '/universities', 'direct', 'Bangladesh', 'Rajshahi', 'Mobile', 'direct', NULL, NULL)
        ON CONFLICT DO NOTHING;
      `);
    }

    console.log('Enterprise migration & seeding finished with 100% success!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
