import { NextResponse } from 'next/server';
import { query, getDatabaseStorageStats } from '@/lib/db';
import { getR2StorageStats } from '@/lib/r2';

export async function GET() {
  try {
    // Run aggregated metric queries in parallel
    const [
      revenueRes,
      expenseRes,
      studentRes,
      leadRes,
      agentRes,
      visitorRes,
      recentLeadsRes,
      recentRevenuesRes,
      recentExpensesRes,
      expenseByCategoryRes,
      databaseStorage,
      objectStorage,
    ] = await Promise.all([
      query(`
        SELECT 
          COALESCE(SUM(total_amount), 0) as gross_revenue,
          COALESCE(SUM(net_company_amount), 0) as net_revenue,
          COALESCE(SUM(agent_commission_amount), 0) as agent_commissions,
          COUNT(*) as invoice_count
        FROM revenues
      `),
      query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_expenses,
          COALESCE(SUM(CASE WHEN category IN ('marketing_meta', 'marketing_google') THEN amount ELSE 0 END), 0) as marketing_spend,
          COALESCE(SUM(CASE WHEN category = 'daily_office' THEN amount ELSE 0 END), 0) as office_spend,
          COUNT(*) as expense_count
        FROM expenses
      `),
      query(`
        SELECT 
          COUNT(*) as total_students,
          COUNT(CASE WHEN status = 'visa_approved' THEN 1 END) as visas_approved,
          COUNT(CASE WHEN status IN ('conditional_offer', 'unconditional_offer') THEN 1 END) as offers_received,
          COUNT(CASE WHEN status = 'applied' THEN 1 END) as applications_lodged
        FROM students
      `),
      query(`
        SELECT 
          COUNT(*) as total_leads,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
          COUNT(CASE WHEN status = 'counseling_scheduled' THEN 1 END) as in_counseling,
          COUNT(CASE WHEN priority = 'high' THEN 1 END) as hot_leads
        FROM leads
      `),
      query(`
        SELECT 
          COUNT(*) as total_agents,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_agents
        FROM users 
        WHERE role = 'agent'
      `),
      query(`
        SELECT 
          COUNT(*) as total_visitors,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM visitors
      `),
      query(`
        SELECT l.*, u.name as agent_name 
        FROM leads l 
        LEFT JOIN users u ON l.assigned_agent_id = u.id 
        ORDER BY l.created_at DESC 
        LIMIT 5
      `),
      query(`
        SELECT r.*, u.name as agent_name, s.full_name as student_name 
        FROM revenues r 
        LEFT JOIN users u ON r.agent_id = u.id 
        LEFT JOIN students s ON r.student_id = s.id 
        ORDER BY r.created_at DESC 
        LIMIT 5
      `),
      query(`
        SELECT e.* 
        FROM expenses e 
        ORDER BY e.created_at DESC 
        LIMIT 5
      `),
      query(`
        SELECT category, SUM(amount) as total 
        FROM expenses 
        GROUP BY category 
        ORDER BY total DESC
      `),
      getDatabaseStorageStats(),
      getR2StorageStats(),
    ]);

    const grossRevenue = Number(revenueRes.rows[0].gross_revenue);
    const netRevenue = Number(revenueRes.rows[0].net_revenue);
    const agentCommissions = Number(revenueRes.rows[0].agent_commissions);
    const totalExpenses = Number(expenseRes.rows[0].total_expenses);
    const netOperatingProfit = grossRevenue - totalExpenses;
    const profitMargin = grossRevenue > 0 ? ((netOperatingProfit / grossRevenue) * 100).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        financials: {
          grossRevenue,
          netRevenue,
          agentCommissions,
          totalExpenses,
          marketingSpend: Number(expenseRes.rows[0].marketing_spend),
          officeSpend: Number(expenseRes.rows[0].office_spend),
          netOperatingProfit,
          profitMargin: Number(profitMargin),
        },
        students: {
          total: Number(studentRes.rows[0].total_students),
          visasApproved: Number(studentRes.rows[0].visas_approved),
          offersReceived: Number(studentRes.rows[0].offers_received),
          applicationsLodged: Number(studentRes.rows[0].applications_lodged),
        },
        leads: {
          total: Number(leadRes.rows[0].total_leads),
          newLeads: Number(leadRes.rows[0].new_leads),
          inCounseling: Number(leadRes.rows[0].in_counseling),
          hotLeads: Number(leadRes.rows[0].hot_leads),
        },
        agents: {
          total: Number(agentRes.rows[0].total_agents),
          active: Number(agentRes.rows[0].active_agents),
        },
        visitors: {
          total: Number(visitorRes.rows[0].total_visitors),
          unique: Number(visitorRes.rows[0].unique_visitors),
        },
        recentLeads: recentLeadsRes.rows,
        recentRevenues: recentRevenuesRes.rows,
        recentExpenses: recentExpensesRes.rows,
        expenseByCategory: expenseByCategoryRes.rows,
        databaseStorage,
        objectStorage,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard metrics' },
      { status: 500 }
    );
  }
}
