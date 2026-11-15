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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'usd' | 'rub' | 'eur'>('usd');
  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1`);
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
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCoins();
  }, [currency])

  const filtredCoins = coins.filter((coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const currencySymbols = {
    'usd': '$',
    'rub': '₽',
    'eur': '€'
  }

  return (
    <div className="app-container">
      <h1>Crypto Tracker</h1>
      <input type="text" placeholder='Поиск монеты...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      <div className='currency-buttons'>
        <button onClick={() => setCurrency('usd')} className={currency === 'usd' ? 'active' : ''}>USD</button>
        <button onClick={() => setCurrency('rub')} className={currency === 'rub' ? 'active' : ''}>RUB</button>
        <button onClick={() => setCurrency('eur')} className={currency === 'eur' ? 'active' : ''}>EUR</button>
      </div>
      {isLoading && <p>Загрузка курсов...</p>}
      <div className="coins-grid">
        {
        filtredCoins.map((coin) => {
          return (
            <div className="coin-card" key={coin.id}>
              <h3>{coin.name}</h3>
              <p>Цена: {coin.price} {currencySymbols[currency]}</p>
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