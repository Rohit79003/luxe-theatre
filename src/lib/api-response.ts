import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, any> | any;
}

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  errors?: Record<string, any> | any,
  status = 400
): NextResponse<ApiResponse> {
  const body: ApiResponse = {
    success: false,
    message,
  };

  if (errors && Object.keys(errors).length > 0) {
    body.errors = errors;
  }

  return NextResponse.json(body, { status });
}
