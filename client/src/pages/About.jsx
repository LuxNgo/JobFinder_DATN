import React from 'react';
import { MetaData } from '../components/MetaData';
import { MdBusinessCenter, MdPeople, MdTrendingUp, MdStar } from 'react-icons/md';

export const About = () => {
  return (
    <>
      <MetaData title="Giới Thiệu" />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-primary-2 text-white py-20">
          <div className="container mx-auto px-4 text-center mt-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Giới Thiệu về JobFinder</h1>
            <p className="text-gray-2 text-lg max-w-2xl mx-auto">
              Người bạn đồng hành tin cậy trong việc phát triển sự nghiệp và thăng tiến nghề nghiệp
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-16 px-4 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <MdBusinessCenter />, number: "10K+", label: "Công Việc Được Đăng" },
              { icon: <MdPeople />, number: "50K+", label: "Người Dùng Đang Hoạt Động" },
              { icon: <MdTrendingUp />, number: "5K+", label: "Công Ty" },
              { icon: <MdStar />, number: "95%", label: "Tỉ Lệ Thành Công" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="text-primary-3 text-3xl mb-4 flex justify-center">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-16 px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Về Chúng Tôi</h2>
              <p className="text-gray-700">
                Tại JobLane, chúng tôi không chỉ là một nền tảng tìm kiếm việc làm – chúng tôi là người bạn đồng hành
                giúp bạn hiện thực hóa những khát vọng nghề nghiệp. Sứ mệnh của chúng tôi là kết nối những cá nhân tài năng
                với những cơ hội đặc biệt giúp thăng tiến sự nghiệp và làm phong phú cuộc sống của họ.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg"> 
              <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Điều Làm Chúng Tôi Khác Biệt</h2>
              <ul className="space-y-4">
                <li>
                  <span className="font-semibold">Sự Kết Hợp Phù Hợp:</span>
                  <p className="text-gray-700">
                    Các thuật toán khớp việc làm tiên tiến của chúng tôi đảm bảo rằng kỹ năng của bạn phù hợp hoàn hảo
                    với các vị trí bạn quan tâm.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Hỗ Trợ Xuất Sắc:</span>
                  <p className="text-gray-700">
                    Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng giúp bạn, từ tối ưu hóa hồ sơ đến chuẩn bị cho các buổi phỏng vấn.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Gia Nhập Cộng Đồng Của Chúng Tôi</h2>
              <p className="text-gray-700 mb-4">
                Khi bạn gia nhập JobLane, bạn sẽ trở thành một phần của cộng đồng năng động gồm các chuyên gia, nhà tuyển dụng và cố vấn.
                Cùng nhau, chúng ta đang định hình tương lai công việc, từng cơ hội một.
              </p>
              <p className="text-gray-700">
                Cảm ơn bạn đã chọn JobLane là đối tác trong việc phát triển sự nghiệp của mình.
                Hãy cùng nhau mở ra một thế giới đầy cơ hội!
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-20">
          <div className="mx-16 px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Các Giá Trị Cốt Lõi Của Chúng Tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
              {[
                {
                  title: "Đổi Mới",
                  description: "Liên tục cải tiến nền tảng của chúng tôi với công nghệ tiên tiến"
                },
                {
                  title: "Chính Trực",
                  description: "Duy trì các tiêu chuẩn cao nhất về đạo đức nghề nghiệp"
                },
                {
                  title: "Tác Động",
                  description: "Mang lại sự khác biệt thực sự trong sự nghiệp và cuộc sống của mọi người"
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
