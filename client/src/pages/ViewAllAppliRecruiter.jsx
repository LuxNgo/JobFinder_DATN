import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { MdOutlineSearch } from "react-icons/md";
import {
  getAllAppRecruiter,
  updateApplication,
} from "../actions/RecruiterActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { HiOutlineSparkles } from "react-icons/hi";
import { Select, Tag, Tooltip } from "antd";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export const ViewAllAppliRecruiter = () => {
  const dispatch = useDispatch();
  const { loading, allApplicationsRecruiter } = useSelector(
    (state) => state.recruiter
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const handleStatusChange = async (id, status) => {
    try {
      // Update local state immediately
      setSelectedStatus((prev) => ({
        ...prev,
        [id]: status,
      }));

      // Make API call
      await dispatch(updateApplication(id, { status }));
    } catch (error) {
      console.error("Error updating status:", error);
      // If API call fails, revert the local state
      setSelectedStatus((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  useEffect(() => {
    dispatch(getAllAppRecruiter());
  }, []);

  useEffect(() => {
    dispatch(getAllAppRecruiter());
  }, []);

  const statusColors = {
    pending: "bg-blue-500",
    rejected: "bg-red-500",
    accepted: "bg-green-500",
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Đang xử lý",
      color: "blue",
    },
    {
      value: "rejected",
      label: "Từ chối",
      color: "red",
    },
    {
      value: "accepted",
      label: "Chấp nhận",
      color: "green",
    },
  ];

  return (
    <>
      <MetaData title="Quản lý ứng viên" />
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="text-blue-500 text-2xl" />
                <h1 className="text-3xl font-bold text-blue-700 uppercase">
                  Quản lý ứng viên
                </h1>
              </div>
              <div className="relative bg-white">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-gray-900 rounded-lg px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-blue-200 shadow-sm"
                />
                <MdOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 transition-transform duration-300" />
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md rounded-lg">
              <table className="w-full text-sm text-center">
                <thead className="text-xs text-gray-900 uppercase bg-blue-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Tên công việc
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Tên ứng viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Hồ sơ
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allApplicationsRecruiter &&
                    Array.isArray(allApplicationsRecruiter) &&
                    allApplicationsRecruiter
                      .filter(
                        (app) =>
                          app &&
                          app.jobTitle &&
                          app.applicantName &&
                          (app.jobTitle
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                            app.applicantName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()))
                      )
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((app, i) => (
                        <tr
                          key={i}
                          className="bg-white border-b hover:bg-blue-50"
                        >
                          <th
                            scope="row"
                            className="w-32 px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {app._id}
                          </th>
                          <td className="px-6 py-4">{app.jobTitle}</td>
                          <td className="px-6 py-4">{app.applicantName}</td>
                          <td className="px-6 py-4">{app.applicantEmail}</td>
                          <td className="px-6 py-6 flex items-center justify-center">
                            <button
                              onClick={open}
                              className="text-blue-400 hover:text-blue-700 hover:font-semibold underline transition-colors"
                            >
                              Xem hồ sơ
                            </button>
                            <Modal
                              opened={opened}
                              onClose={close}
                              title="Xem CV"
                              size="xl"
                              centered
                            >
                              <img src={app.applicantResume.url} alt="CV" />
                            </Modal>
                          </td>
                          <td className="px-6 py-4 w-56">
                            <div
                              className="flex items-center gap-4 transition-all duration-300"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                            >
                              <Tooltip
                                title={
                                  statusOptions.find(
                                    (option) =>
                                      option.value === selectedStatus[app._id]
                                  )?.label
                                }
                              ></Tooltip>
                              <Select
                                value={selectedStatus[app._id]}
                                onChange={(value) =>
                                  handleStatusChange(app._id, value)
                                }
                                className="w-40 bg-transparent border-none focus:outline-none shadow-none"
                                suffixIcon={null}
                                variant="borderless"
                                defaultValue={app.status}
                              >
                                {statusOptions.map(
                                  ({ value, label, color, icon }) => (
                                    <Select.Option key={value} value={value}>
                                      <div className="flex items-center gap-2">
                                        {icon}
                                        <Tag
                                          color={color}
                                          className="flex items-center justify-center w-full h-6 font-semibold rounded-xl text-sm bg-opacity-20 text-black"
                                        >
                                          {label}
                                        </Tag>
                                      </div>
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
