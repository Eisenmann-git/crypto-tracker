import { useState, useEffect } from 'react';
import './App.css';


interface Coin {
  id:  string;
  name: string;
  price: number;
  change24h: number;
}

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        const data = await response.json();
        const formattedCoins: Coin[] = data.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            price: item.current_price,
            change24h: item.price_change_percentage_24h
          }
        });
        setCoins(formattedCoins);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCoins();
  }, [])

  return (
    <div className="app-container">
      <h1>Crypto Tracker</h1>
      {isLoading && <p>Загрузка курсов...</p>}
      <div className="coins-grid">
        {
        coins.map((coin) => {
          return (
            <div className="coin-card" key={coin.id}>
              <h3>{coin.name}</h3>
              <p>Цена: {coin.price} $</p>
              <p style={{color: coin.change24h >= 0 ?'#4ade80':'#f87171'}}>24ч: {coin.change24h.toFixed(2)} %</p>
            </div>
          )
        })
      }
      </div>
    </div>
  );
}

export default App;