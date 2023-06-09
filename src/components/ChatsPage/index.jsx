import { useEffect, useState } from 'react';
import './ChatsPage.css';
import { useForm } from 'react-hook-form';

const ChatsPage = ({ user, setUser }) => {
  const [sentMessages, setSentMessages] = useState([]);
  const [enterPhone, setEnterPhone] = useState(false);
  const [chatId, setChatId] = useState();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [incomingMessage, setIncomingMessage] = useState([]);

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

  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      let url = `https://api.green-api.com/waInstance${user.idInstance}/sendMessage/${user.apiTokenInstance}`;

      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          chatId: `${chatId}@c.us`,
          message: message,
        }),
      });
      await response.json();
      setSentMessages([...sentMessages, message]);
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  const getMessage = async () => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${user.idInstance}/receiveNotification/${user.apiTokenInstance}`,
      );
      const data = await response.json();
      console.log(data);
      if (Object.keys(data.body.messageData.textMessageData).includes('textMessage')) {
        setIncomingMessage([...incomingMessage, data.body.messageData.textMessageData.textMessage]);
        console.log(incomingMessage);
      } else if (Object.keys(data.body.messageData.extendedTextMessageData).includes('text')) {
        setIncomingMessage([...incomingMessage, data.body.messageData.extendedTextMessageData.text]);
        console.log(incomingMessage);
      } else {
        console.log('Какая-то дичь');
      }

      let res = await fetch(
        `https://api.green-api.com/waInstance${user.idInstance}/deleteNotification/${user.apiTokenInstance}/${data.receiptId}`,
        {
          method: 'DELETE',
        },
      );
      let result = await res.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (enterPhone) {
      getMessage();
    }
  });

  return (
    <div className="absolute top-0 bottom-0 max-w-screen-md bg-white my-4 mx-auto flex justify-between w-full rounded">
      {!enterPhone && (
        <form
          className="bg-[#f0f2f5] w-full h-full py-5 flex flex-col justify-center items-center rounded gap-5"
          onSubmit={handleSubmit(createChat)}>
          <div className="bg-white w-1/2 p-10">
            {error && <p>Неверно введен номер</p>}
            <input
              className="w-full outline-none px-2 py-1 border border-[#00a884] rounded"
              placeholder="Введите номер"
              name="phone"
              {...register('phone', { required: 'Укажите телефон получателя' })}
            />
            <p>Укажите номер получателя без пробелов</p>
            <p>Пример: 89991234567</p>
            <p>{errors.phone?.message}</p>
          </div>
          <button
            className="border-none bg-white px-5 py-3 text-lg rounded cursor-pointer flex items-center w-1/2"
            type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-[#00a884]">
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Создать чат
          </button>
        </form>
      )}
      {enterPhone && (
        <form
          className="bg-[url('https://damion.club/uploads/posts/2022-01/1642423515_7-damion-club-p-standartnii-fon-whatsapp-7.png')] w-full h-full bg-cover relative rounded overflow-hidden"
          onSubmit={sendMessage}>
          <div className="absolute top-0 left-0 right-0 bg-[#f0f2f5] flex justify-between items-center h-24 py-5">
            <p>{chatId}</p>
            <button
              onClick={() => {
                window.confirm('Вы действительно хотите выйти?') &&
                  setUser({
                    idInstance: null,
                    apiTokenInstance: null,
                  });
              }}>
              Выйти
            </button>
          </div>
          <div className="absolute top-28 right-3 flex flex-col gap-5 items-end w-1/2">
            {sentMessages.map((message, index) => {
              return (
                <p className="bg-[#00a884] px-5 py-2 rounded w-fit text-end" key={index}>
                  {message}
                </p>
              );
            })}
          </div>
          {incomingMessage.length > 0 && (
            <div className="absolute top-28 left-3 flex flex-col gap-5 items-start w-1/2">
              {incomingMessage.map((message, index) => {
                return (
                  <p className="bg-[#00a884] px-5 py-2 rounded w-fit text-end" key={index}>
                    {message}
                  </p>
                );
              })}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-[#f0f2f5] p-5 flex justify-center h-20 gap-5">
            <input
              className="outline-none px-2 py-1 border border-[#00a884] rounded w-full"
              placeholder="Введите сообщение"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button className="bg-[#00a884] p-2 rounded-full flex items-center justify-center" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatsPage;
