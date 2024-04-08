"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Login() {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [error, setError] = useState(null);

  const onSubmit = async (data :any) => {
    
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if(res && res.error)
    {
      console.log("Error!");  
    }
    else
    {

      router.push('./dashboard');
      router.refresh();
    }
  };


  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        {error && (
          <p className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">{error}</p>
        )}
  
        <h1 className="text-gray-800 font-bold text-3xl mb-6 text-center">UPSMILE</h1>
  
        <div className="mb-4">
          <label htmlFor="username" className="text-gray-600 text-sm">Username</label>
          <input
            type="text"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
            className="p-3 rounded-lg block w-full mt-1 border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Ingrese su nombre de usuario"
          />
          {errors.username && <span className="text-red-500 text-xs"></span>}
        </div>
  
        <div className="mb-6">
          <label htmlFor="password" className="text-gray-600 text-sm">Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className="p-3 rounded-lg block w-full mt-1 border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Ingrese su contraseña"
          />
          {errors.password && <span className="text-red-500 text-xs"> </span>}
        </div>
  
        <button className="bg-blue-500 text-white p-4 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}  

export default Login;


