import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MetaData } from '../components/MetaData';
import { deleteAccount } from '../actions/UserActions';
import { Loader } from '../components/Loader';
import { 
  AiOutlineLock, 
  AiOutlineEye, 
  AiOutlineEyeInvisible,
  AiOutlineWarning
} from 'react-icons/ai';

const PasswordInput = ({ value, onChange, showPassword, onTogglePassword }) => (
  <div className="bg-white flex items-center rounded-lg border border-border-primary overflow-hidden">
    <div className="text-gray-2 px-3 py-2">
      <AiOutlineLock size={20} />
    </div>
    <input
      value={value}
      onChange={onChange}
      required
      placeholder="Enter your password"
      type={showPassword ? "text" : "password"}
      className="outline-none w-full text-gray-primary px-3 py-2"
    />
    <button
      type="button"
      onClick={onTogglePassword}
      className="text-gray-2 px-3 py-2 hover:text-gray-primary transition-colors"
    >
      {showPassword ? 
        <AiOutlineEyeInvisible size={20} /> : 
        <AiOutlineEye size={20} />
      }
    </button>
  </div>
);

const WarningMessage = () => (
  <div className="bg-surface-fill-container-secondary p-4 rounded-lg border border-stroke-primary-2">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <AiOutlineWarning className="h-5 w-5 text-destructive" />
      </div>
      <div className="ml-3">
        <p className="text-text-secondary">
          <span className="font-semibold text-destructive">
            This action cannot be undone.
          </span>{' '}
          All your data will be permanently deleted.
        </p>
      </div>
    </div>
  </div>
);

export const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isLogin } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    password: '',
    showPassword: false,
    confirmDelete: false
  });

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirmDelete) {
      return;
    }
    dispatch(deleteAccount({ password: formData.password }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-defaults-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <MetaData title="Delete Account" />
      <div className="min-h-screen bg-defaults-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto animate-fade-in transform transition-all duration-500 ease-in-out">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-card p-8 space-y-8 border border-stroke-primary-2 
                     hover:border-stroke-primary-1 transition-all duration-300 
                     shadow-lg"
          >
            {/* Header with red text */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-primary-700">
                Delete Account
              </h1>
              <p className=" text-sm">
                Please confirm your password to delete your account
              </p>
            </div>

            {/* Warning Message with red text */}
            <div className="bg-white p-6 rounded-lg border border-destructive 
                          transform transition-all duration-300 
                          shadow-sm hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <AiOutlineWarning className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-2 text-lg">
                    Warning: This action cannot be undone!
                  </h3>
                  <p className="text-destructive text-sm leading-relaxed font-medium">
                    Once you delete your account, all your data will be permanently removed. This includes:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center text-destructive 
                                 transition-colors duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive mr-2"></span>
                      Profile information & personal data
                    </li>
                    <li className="flex items-center text-destructive 
                                 transition-colors duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive mr-2"></span>
                      Account settings & preferences
                    </li>
                    <li className="flex items-center text-destructive 
                                 transition-colors duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive mr-2"></span>
                      Activity history & saved data
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <div className="bg-white flex items-center rounded-lg border border-stroke-primary-2 
                            hover:border-stroke-primary-1 transition-all duration-300 
                            focus-within:border-stroke-primary-1 focus-within:shadow-sm 
                            group">
                <div className="text-text-secondary group-hover:text-text-primary-1 px-4 py-3 
                              transition-colors duration-300">
                  <AiOutlineLock size={20} />
                </div>
                <input
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="Enter your password"
                  type={formData.showPassword ? "text" : "password"}
                  className="outline-none w-full text-text-primary bg-transparent px-0 py-3 
                           placeholder:text-text-disable"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="text-text-secondary hover:text-text-primary-1 px-4 py-3 
                           transition-colors duration-300"
                >
                  {formData.showPassword ? 
                    <AiOutlineEyeInvisible size={20} /> : 
                    <AiOutlineEye size={20} />
                  }
                </button>
              </div>
            </div>

            {/* Enhanced Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-surface-fill-container-secondary rounded-lg 
                          border border-stroke-primary-2 hover:border-stroke-primary-1 
                          transition-all duration-300">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={formData.confirmDelete}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmDelete: e.target.checked }))}
                className="mt-1 h-4 w-4 text-destructive focus:ring-destructive 
                         border-stroke-primary-2 rounded transition-colors cursor-pointer"
              />
              <label 
                htmlFor="confirm-delete" 
                className="text-text-secondary text-sm leading-relaxed cursor-pointer 
                         hover:text-text-primary transition-colors duration-300"
              >
                I understand that by deleting my account, all my data will be permanently removed and 
                this action cannot be reversed.
              </label>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={!formData.confirmDelete || loading}
                className={`
                  w-full py-3 px-4 rounded-lg text-white font-medium
                  flex items-center justify-center gap-2
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${formData.confirmDelete 
                    ? 'bg-destructive hover:bg-destructive/90' 
                    : 'bg-disabled cursor-not-allowed opacity-50'}
                `}
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineWarning className="h-5 w-5" />
                    Delete Account
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full py-3 px-4 rounded-lg text-text-secondary 
                         border border-stroke-primary-2 hover:bg-surface-fill-container-secondary 
                         transition-all duration-300 transform hover:scale-[1.02]
                         hover:text-text-primary-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};






