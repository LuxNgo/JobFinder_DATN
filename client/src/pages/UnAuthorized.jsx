import { Link } from "react-router-dom";

function UnAuthorized() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 py-20">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          401
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
          Truy cập không được ủy quyền
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
          Rất tiếc, bạn đã cố gắng truy cập một trang mà bạn không được ủy
          quyền. Vui lòng đăng nhập với một người dùng khác hoặc quay lại trang
          chủ.
        </p>
        <Link to="/">
          <button className="text-lg font-medium px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 transition-all duration-300 ease-in-out text-white">
            Trở về trang chủ
          </button>
        </Link>
      </div>
    </main>
  );
}

export default UnAuthorized;
