export default function StaffPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Nhân sự</h1>
          <p className="mt-1 text-sm text-secondary">Quản lý nhân viên và designer</p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <p className="text-secondary">Danh sách nhân sự đang được phát triển</p>
      </div>
    </div>
  );
}