import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [username, usernamed] = useState('');
  const [validate, validated] = useState(false);
  const [mount, mounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    mounted(true);
  }, []);

  useEffect(() => {
    if (mount) {
      const valid = /^[A-Z]{3,9}$/.test(username);
      validated(valid);
    }
  }, [username, mount]);

  const manhandle = (e) => {
    e.preventDefault();
    if (validate) {
      localStorage.setItem('username', username);
      router.push('/menu');
    }
  };

  const switcheroo = (e) => {
    const uppercasedValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    usernamed(uppercasedValue);
  };

  return (
    <div className='container'>
      <h1>PLAYER 1</h1>
      <form onSubmit={manhandle}>
        <input
          type='text'
          className='nes-input'
          value={username}
          placeholder='USERNAME'
          onChange={switcheroo}
          style={{ textTransform: 'uppercase' }}
        />
        <button
          className={`nes-btn ${!validate ? 'is-disabled' : ''}`}
          type='submit'
        >
          START
        </button>
      </form>
    </div>
  );
}
