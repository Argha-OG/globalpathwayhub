import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateSessionToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const res = await query(
      'SELECT id, name, email, password_hash, role, phone, branch, commission_rate, status FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = res.rows[0];

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is inactive. Please contact administration.' },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      branch: user.branch,
      commissionRate: Number(user.commission_rate || 0),
    };

    const token = generateSessionToken(userData);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
