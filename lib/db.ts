import { Pool, Client } from 'pg';
import path from 'path';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL;
const unpooledConnectionString = process.env.DATABASE_URL_UNPOOLED || connectionString;

// Next.js singleton pattern for connection pool
let pool;
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else {
  if (!global.neonPool) {
    global.neonPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  pool = global.neonPool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  return res;
}

export function formatUniversity(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    country: row.country,
    location: row.location,
    website: row.website,
    description: row.description,
    logo: row.logo,
    details: row.details || {},
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatCourse(row, populatedUni = null) {
  if (!row) return null;
  let university = populatedUni;
  if (!university && row.u_name) {
    university = {
      _id: row.university_id,
      name: row.u_name,
      country: row.u_country,
      location: row.u_location,
      website: row.u_website,
      description: row.u_description,
      logo: row.u_logo,
      createdAt: row.u_created_at ? new Date(row.u_created_at).toISOString() : null,
    };
  } else if (!university) {
    university = row.university_id;
  }

  return {
    _id: row.id,
    name: row.name,
    universityId: row.university_id,
    university: university,
    level: row.level,
    duration: row.duration,
    tuitionFee: row.tuition_fee,
    description: row.description,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatApplication(row) {
  if (!row) return null;
  const extraData = row.data && typeof row.data === 'object' ? row.data : {};
  return {
    _id: row.id,
    ...extraData,
    fullName: row.full_name || extraData.fullName,
    email: row.email || extraData.email,
    phone: row.phone || extraData.phone,
    country: row.country || extraData.country,
    universityId: row.university_id || extraData.universityId,
    courseId: row.course_id || extraData.courseId,
    status: row.status || 'pending',
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
  };
}

export function formatStudent(row) {
  if (!row) return null;
  return {
    id: row.id,
    studentCode: row.student_code,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : null,
    nationality: row.nationality,
    passportNumber: row.passport_number,
    highestEducation: row.highest_education,
    gpa: row.gpa,
    englishTest: row.english_test,
    englishScore: row.english_score,
    targetCountry: row.target_country,
    targetUniversity: row.target_university,
    targetCourse: row.target_course,
    targetIntake: row.target_intake,
    status: row.status,
    assignedAgentId: row.assigned_agent_id,
    assignedAgentName: row.agent_name || null,
    notes: row.notes,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatLead(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    preferredCountry: row.preferred_country,
    preferredDegree: row.preferred_degree,
    leadSource: row.lead_source,
    status: row.status,
    priority: row.priority,
    assignedAgentId: row.assigned_agent_id,
    assignedAgentName: row.agent_name || null,
    estimatedCommission: Number(row.estimated_commission || 0),
    notes: row.notes,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatExpense(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    amount: Number(row.amount || 0),
    currency: row.currency || 'USD',
    expenseDate: row.expense_date ? new Date(row.expense_date).toISOString().split('T')[0] : null,
    paidTo: row.paid_to,
    paymentMethod: row.payment_method,
    receiptUrl: row.receipt_url,
    notes: row.notes,
    recordedByName: row.recorded_by_name || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatRevenue(row) {
  if (!row) return null;
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    title: row.title,
    category: row.category,
    totalAmount: Number(row.total_amount || 0),
    netCompanyAmount: Number(row.net_company_amount || 0),
    agentCommissionAmount: Number(row.agent_commission_amount || 0),
    currency: row.currency || 'USD',
    studentId: row.student_id,
    studentName: row.student_name || null,
    agentId: row.agent_id,
    agentName: row.agent_name || null,
    status: row.status,
    paymentDate: row.payment_date ? new Date(row.payment_date).toISOString().split('T')[0] : null,
    paymentMethod: row.payment_method,
    notes: row.notes,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function initDatabase() {
  const migrationClient = new Client({
    connectionString: unpooledConnectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await migrationClient.connect();
    await migrationClient.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL,
        location TEXT NOT NULL,
        website TEXT,
        description TEXT,
        logo TEXT,
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE universities ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        level TEXT NOT NULL,
        duration TEXT NOT NULL,
        tuition_fee TEXT,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        country TEXT,
        university_id TEXT,
        course_id TEXT,
        status TEXT DEFAULT 'pending',
        data JSONB DEFAULT '{}'::jsonb,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );

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

      CREATE INDEX IF NOT EXISTS idx_courses_university_id ON courses(university_id);
      CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
      CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
    `);
  } finally {
    await migrationClient.end();
  }
}

export async function getDatabaseStorageStats() {
  try {
    const [sizeRes, tableRes, countsRes] = await Promise.all([
      query('SELECT pg_database_size(current_database()) as size_bytes, pg_size_pretty(pg_database_size(current_database())) as size_pretty'),
      query("SELECT count(1) as total_tables FROM information_schema.tables WHERE table_schema = 'public'"),
      query(`
        SELECT 
          (SELECT count(1) FROM students) as students_count,
          (SELECT count(1) FROM student_documents) as docs_count,
          (SELECT count(1) FROM leads) as leads_count,
          (SELECT count(1) FROM revenues) as revenues_count,
          (SELECT count(1) FROM expenses) as expenses_count,
          (SELECT count(1) FROM universities) as unis_count,
          (SELECT count(1) FROM courses) as courses_count,
          (SELECT count(1) FROM users) as users_count,
          (SELECT count(1) FROM visitors) as visitors_count
      `),
    ]);

    const usedBytes = Number(sizeRes.rows[0]?.size_bytes || 0);
    const limitBytes = Number(process.env.NEON_STORAGE_LIMIT_BYTES) || 512 * 1024 * 1024; // 512 MB Neon starter tier

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const counts = countsRes.rows[0] || {};
    const totalRows = Object.values(counts).reduce((acc: number, v: any) => acc + Number(v || 0), 0);

    return {
      connected: true,
      usedBytes,
      usedPretty: formatBytes(usedBytes),
      sizePretty: sizeRes.rows[0]?.size_pretty || formatBytes(usedBytes),
      limitBytes,
      limitPretty: formatBytes(limitBytes),
      usagePercent: Number(((usedBytes / limitBytes) * 100).toFixed(2)),
      tablesCount: Number(tableRes.rows[0]?.total_tables || 0),
      totalRows,
      breakdown: counts,
    };
  } catch (err) {
    console.error('[DB] Failed to get database storage stats:', err.message);
    return {
      connected: false,
      usedBytes: 0,
      usedPretty: '0 B',
      sizePretty: 'Unknown',
      limitBytes: 512 * 1024 * 1024,
      limitPretty: '512 MB',
      usagePercent: 0,
      tablesCount: 0,
      totalRows: 0,
      error: err.message,
    };
  }
}

export { pool };
