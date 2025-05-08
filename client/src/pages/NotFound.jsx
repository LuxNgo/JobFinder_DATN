import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 py-20">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
          Không tìm thấy trang
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
          Trang bạn đang tìm kiếm không tồn tại. Nó có thể đã được di chuyển
          hoặc xóa.
        </p>
        <Link to="/">
          <button className="text-lg font-medium px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out text-white">
            Trở về trang chủ
          </button>
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
