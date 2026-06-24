export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <div className="relative hidden md:flex md:w-1/2 md:items-center md:justify-center md:bg-gradient-to-br md:from-[#1a1614] md:via-[#2C2822] md:to-[#3D352C] md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,115,85,0.12)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-md">
          <a href="/" className="text-2xl font-medium tracking-tight text-white">
            Maison
          </a>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Thiết kế nội thất minh bạch từ ý tưởng đến bàn giao.
          </p>
          <div className="mt-16 space-y-6">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-primary">
                1
              </span>
              <div>
                <p className="text-sm font-medium text-white">Chọn đội ngũ thiết kế</p>
                <p className="mt-0.5 text-xs text-white/40">
                  Kết nối với những nhà thiết kế tài năng
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-primary">
                2
              </span>
              <div>
                <p className="text-sm font-medium text-white">Theo dõi tiến độ real-time</p>
                <p className="mt-0.5 text-xs text-white/40">
                  Mọi thay đổi đều được cập nhật tức thì
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-primary">
                3
              </span>
              <div>
                <p className="text-sm font-medium text-white">Phản hồi trực tiếp trên bản vẽ</p>
                <p className="mt-0.5 text-xs text-white/40">
                  Góp ý ngay tại vị trí cần thay đổi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 md:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
