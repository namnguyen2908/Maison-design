import { type NextRequest } from "next/server";
import { callBackend } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  return callBackend(req);
}

export async function POST(req: NextRequest) {
  return callBackend(req);
}

export async function PUT(req: NextRequest) {
  return callBackend(req);
}

export async function PATCH(req: NextRequest) {
  return callBackend(req);
}

export async function DELETE(req: NextRequest) {
  return callBackend(req);
}
