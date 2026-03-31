import React, { useState } from 'react';
import Loader from '../../../utils/Loader';
import IMAGES from '../../../assets/images';
import { FaAsterisk } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../../../context/UserContext';
import { getAllLevels } from '../../../api/Admin/LevelsApi';
import { registerStudent } from '../../../api/Student/StudentApis';
import { toast } from 'react-toastify';

const SignUp = () => {
  const CustomInput = ({ label, placeholder, type }) => {
    return (
      <div className="flex flex-col text-start py-1">
        <div className="flex flex-col gap-2">
          <div className="font-medium flex gap-1">
            <p>{label}</p>
            <p className="font-normal">
              <FaAsterisk size={6} color="red" className="mt-1" />
            </p>
          </div>
          <div>
            <input
              className={`border outline-none rounded-sm border-black/20 px-4 w-full py-[4px] ${type === 'password' ? 'font-bold text-xl' : ''
                } placeholder:text-base placeholder:font-normal `}
              required
              type={type}
              placeholder={placeholder}
            />
          </div>
        </div>
      </div>
    );
  };

  const CustomSelectable = ({ label, options }) => {
    return (
      <div className="flex flex-col text-start py-1">
        <div className="flex flex-col gap-2">
          <div className="font-medium">{label}</div>
          <div>
            <select className="border outline-none rounded-sm border-black/20 px-4 w-full py-[4px]">
              <option value="">Choose Class</option>
              {options?.map((item) => {
                return <option value={JSON.stringify(item)}>{item.name}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const Selectable = ({ label }) => {
    return (
      <div className="flex flex-col text-start py-1">
        <div className="flex flex-col gap-2">
          <div className="font-medium">{label}</div>
          <div>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              className="border outline-none rounded-sm border-black/20 px-4 w-full py-[4px]"
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataBody = {};

      if (role === 'parent') {
        dataBody = {
          userType: role,
          sName: e.target[1].value,
          sID: e.target[2].value,
          password: e.target[3].value,
        };
      } else if (role === 'student') {
        dataBody = {
          userType: role,
          name: e.target[1].value,
          email: e.target[2].value,
          phoneNumber: e.target[3].value,
          gender: e.target[4].value,
          levelID: JSON.parse(e.target[5].value).id,
          guardianName: e.target[6].value,
          guardianEmail: e.target[7].value,
          guardianPhoneNumber: e.target[8].value,
          password: e.target[9].value,
        };
      } else if (role === 'teacher') {
        dataBody = {
          userType: role,
          name: e.target[1].value,
          email: e.target[2].value,
          phoneNumber: e.target[3].value,
          password: e.target[4].value,
        };
      }

      const response = await registerStudent(dataBody);

      setUserData(response);
      if (response.userType === "student") {
        toast.success("Student registered successfully!")
      } else if (response.userType === "teacher") {
        toast.success("Teacher registered successfully!")
      }
      navigate('/routes');
    } catch (error) {
      console.log('error in student login UI screen is : ', error);
    }

    setLoading(false);
  };

  const { setUserData } = useUser();
  const navigate = useNavigate();

  const handleGoToLogIn = () => {
    navigate('/routes');
  };

  const { data, isPending } = useQuery({ queryKey: ['loginlevels'], queryFn: getAllLevels });

  return (
    <div
      className="flex min-h-screen w-full flex-col md:flex-row flex-1 bg-[#0B1053]"
      // style={{
      //   background:
      //     'linear-gradient(140.21deg, rgba(243, 233, 233, 0.4) -6.93%, rgba(246, 246, 246, 0) 98.1%)',
      // }}
    >
      <div className=" bg-cover bg-hero-pattern absolute w-60 h-60 lg:w-72 lg:h-72 2xl:h-96 2xl:w-96"></div>
      <div className="flex flex-[4] lg:flex-1 px-4 py-10 md:py-0 md:px-10 items-center justify-center">
        <div className="flex flex-col flex-1">
          {/* <div className="flex w-full items-center justify-center 2xl:items-center md:items-end md:justify-end 2xl:justify-center flex-[2] flex-col">
            <img src={IMAGES.logo} alt="" className="w-60 h-44 lg:auto lg:h-auto bg-cover" />
          </div> */}
          <div className="flex justify-center items-center  flex-1 flex-col ">
            <img src={IMAGES.register_girl} alt="" className="w-72 h-52 lg:auto lg:auto  bg-contain" />
            <p className='text-white text-md '>Technology with Vision, Excellence & Quality</p>
          </div>
        </div>
      </div>
      <div className="flex flex-[6] lg:flex-1 ">
        <div className="flex flex-col flex-1 px-4 md:px-4 py-6 justify-center items-center text-center">
          <div className="flex flex-col w-full bg-white h-full px-4 md:px-8 lg:px-10 xl:px-16 py-10 md:w-4/5">
            <div className="py-2">
              <p className="text-2xl font-medium">Create an Account</p>
              <p className="text-sm text-black/60">Welcome back please enter you details</p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="overflow-auto h-80 register-scrollbar 2xl:h-full">
                  <Selectable label={'Occupation'} />
                  {role === 'student' && (
                    <>
                      <CustomInput label={'Name'} type="text" placeholder={'Enter your Name'} />
                      <CustomInput label={'Email'} type="email" placeholder={'Enter your Email'} />
                      <CustomInput label={'Phone no.'} type="text" placeholder={'Enter your Phone Number'} />
                      <CustomInput label={'Gender'} type="text" placeholder={"Enter your gender (e.g., Male or Female)"} />

                      {!isPending && <CustomSelectable label={'Enroll In'} options={data} />}
                      <CustomInput label={'Guardian Name'} type="text" placeholder={'Enter Guardian Name'} />
                      <CustomInput label={'Guardian Email'} type="email" placeholder={'Enter Guardian Email'} />
                      <CustomInput label={'Guardian Phone no.'} type="text" placeholder={'Enter Guardian Phone no.'} />
                      <CustomInput label={'Password'} type="password" placeholder={'Enter your Password'} />
                      <CustomInput label={'Confirm Password'} type="password" placeholder={'Confirm your Password'} />
                    </>
                  )}
                  {role === 'parent' && (
                    <>
                      <CustomInput label={'Student Name'} type="text" placeholder={'Enter student Name'} />
                      <CustomInput label={'Student ID'} type="text" placeholder={'Enter student ID'} />
                      <CustomInput label={'Password'} type="password" placeholder={'Enter your Password'} />
                      <CustomInput label={'Confirm Password'} type="password" placeholder={'Confirm your Password'} />
                    </>
                  )}
                  {role === 'teacher' && (
                    <>
                      <CustomInput label={'Name'} type="text" placeholder={'Enter your Name'} />
                      <CustomInput label={'Email'} type="email" placeholder={'Enter your Email'} />
                      <CustomInput label={'Phone No'} type="number" placeholder={'Add Phone Number...'} />
                      <CustomInput label={'Password'} type="password" placeholder={'Enter your Password'} />
                      <CustomInput label={'Confirm Password'} type="password" placeholder={'Confirm your Password'} />
                    </>
                  )}
                </div>
                <div className="py-4 flex flex-col gap-2">
                  {loading ? (
                    <>
                      <Loader />
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="flex bg-[#6A00FF] text-white rounded-md py-2 px-4 justify-center items-center text-center cursor-pointer hover:bg-[#007EEA]"
                    >
                      Sign up
                    </button>
                  )}
                  <p className="text-[#000000]/70 text-sm">
                    Don't have an account?{' '}
                    <span
                      onClick={handleGoToLogIn}
                      className="text-[#000000]/50 cursor-pointer hover:text-[#00000090] font-medium underline"
                    >
                      Sign in
                    </span>{' '}
                    now
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
