import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${values.idInstance}/getStateInstance/${values.apiTokenInstance}`,
      );
      const data = await response.json();
      if (data.stateInstance === 'authorized') {
        setIsAuth(false);
        setUser({ idInstance: values.idInstance, apiTokenInstance: values.apiTokenInstance });
        navigate('/chat');
        reset(response);
      }
    } catch (error) {
      setIsAuth(true);
      reset(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full px-2 sm:w-1/2 lg:w-1/3">
      {isAuth && <p className="text-center font-medium">Не удалось авторизоваться</p>}
      <div>
        <input
          placeholder="Укажите id"
          name="idInstance"
          {...register('idInstance', { required: 'Укажите idInstance' })}
          className="login_input"
        />
        <p className="text-sm text-neutral-700">{errors.idInstance?.message}</p>
      </div>
      <div>
        <input
          placeholder="Укажите token"
          name="apiTokenInstance"
          {...register('apiTokenInstance', { required: 'Укажите apiTokenInstance' })}
          className="login_input"
        />
        <p className="text-sm text-neutral-700">{errors.apiTokenInstance?.message}</p>
      </div>
      <div className="flex justify-between items-center gap-5">
        <button type="submit" className="login_button bg-[#00a884]">
          Войти
        </button>
        <a href="https://console.green-api.com/auth/register" target="_blank" rel="noreferrer" className="login_button">
          Регистрация
        </a>
      </div>
    </form>
  );
};

export default LoginPage;
