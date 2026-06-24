export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Dự án</h1>
          <p className="mt-1 text-sm text-secondary">Quản lý danh sách dự án</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
          Tạo dự án mới
        </button>
      </div>
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <p className="text-secondary">Danh sách dự án đang được phát triển</p>
      </div>
    </div>
  );
}