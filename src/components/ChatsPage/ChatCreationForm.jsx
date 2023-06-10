import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateChatSVG } from '../SVG';

const ChatCreationForm = ({ setChatId, setEnterPhone }) => {
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
    },
    mode: 'onSubmit',
  });

  const createChat = (values) => {
    if (values.phone.length === 11) {
      setChatId(values.phone);
      setEnterPhone(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <form
      className="bg-[#f0f2f5] w-full h-full py-5 flex flex-col justify-center items-center rounded gap-5 px-2"
      onSubmit={handleSubmit(createChat)}>
      <div className="bg-white w-full sm:w-3/5 md:w-1/2 px-5 py-8 md:p-8">
        {error && <p className="text-red-600 text-center py-2">Неверно введен номер</p>}
        {errors.phone && <p className="text-red-600 text-center py-2">{errors.phone?.message}</p>}
        <input
          className="w-full outline-none px-2 py-1 border border-[#00a884] rounded"
          placeholder="Введите номер"
          name="phone"
          {...register('phone', { required: 'Не указан телефон получателя' })}
          onChange={() => setError(false)}
        />
        <p className="text-sm text-neutral-600">
          Укажите номер телефона без пробелов и символов, например, 79991234567
        </p>
      </div>
      <button
        className="border-none bg-white px-5 py-3 text-lg rounded cursor-pointer flex items-center justify-center gap-2 w-full sm:w-3/5 md:w-1/2 text-center"
        type="submit">
        <CreateChatSVG />
        Создать чат
      </button>
    </form>
  );
};

export default ChatCreationForm;
