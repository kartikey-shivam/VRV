import { NextResponse } from 'next/server'
import axios from 'axios'
export async function GET() {
  let token:any;
  if (typeof window !== "undefined") {
     token = localStorage.getItem("token");
  }
  try {
    

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      data: {
        data: { user },
      },
    } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[USER_GET]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

