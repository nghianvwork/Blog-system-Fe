import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, firstname, lastname } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    
    const newUser = {
      id: Date.now(),
      username,
      email,
      firstname,
      lastname,
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi server", error: String(error) },
      { status: 500 }
    );
  }
}
