import { useEffect, useState } from "react";
import { getAllAccounts } from './runtime';

function App() {
  const [allAccounts, setAllAccounts] = useState([]);
  const getAccounts = async () => {
    const accounts = await getAllAccounts();
    setAllAccounts(accounts);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <>
      <div>12213</div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
