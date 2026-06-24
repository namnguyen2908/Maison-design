export default function ThemesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Giao diện</h1>
        <p className="mt-1 text-sm text-secondary">Tùy chỉnh giao diện hệ thống</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text">Chế độ giao diện</label>
            <div className="mt-2 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="theme" defaultChecked className="h-4 w-4 text-primary" />
                <span className="text-sm text-text">Sáng</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="theme" className="h-4 w-4 text-primary" />
                <span className="text-sm text-text">Tối</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="theme" className="h-4 w-4 text-primary" />
                <span className="text-sm text-text">Theo hệ thống</span>
              </label>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <label className="block text-sm font-medium text-text">Màu chủ đạo</label>
            <div className="mt-2 flex gap-3">
              <button className="h-10 w-10 rounded-full bg-[#8B7355] ring-2 ring-offset-2 ring-primary" />
              <button className="h-10 w-10 rounded-full bg-[#4A7C59]" />
              <button className="h-10 w-10 rounded-full bg-[#2C2822]" />
              <button className="h-10 w-10 rounded-full bg-[#B34A4A]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}