import "./Transactions.css";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  ExternalLink,
  Copy,
} from "lucide-react";

export default function Transactions({
  transactions,
  search,
  setSearch,
  filter,
  setFilter,
}) {
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filter === "All" || tx.type === filter;

    const matchesSearch =
      tx.type?.toLowerCase().includes(search.toLowerCase()) ||
      tx.hash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transactions-page">

      <div className="transactions-header">

        <h1>Transactions</h1>

        <p>Your complete on-chain activity.</p>

      </div>

      {/* Search */}

      <div className="search-box">

        <Search size={18} />

        <input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Filters */}

      <div className="filters">

        {["All","Sent","Received"].map(item => (

          <button
            key={item}
            className={
              filter===item
              ? "active-filter"
              : ""
            }
            onClick={()=>setFilter(item)}
          >
            {item}
          </button>

        ))}

      </div>

      {/* List */}

      <div className="transaction-list">

        {filteredTransactions.length===0 ? (

          <div className="empty-state">

            <h3>No Transactions</h3>

            <p>
              Your activity will appear here.
            </p>

          </div>

        ) : (

          filteredTransactions.map(tx=>(

            <div
              className="transaction-card"
              key={tx.id}
            >

              <div className="tx-icon">

                {tx.type==="Sent"
                  ? <ArrowUpRight size={20}/>
                  : <ArrowDownLeft size={20}/>
                }

              </div>

              <div className="tx-info">

                <h3>{tx.type}</h3>

                <small>{tx.time}</small>

              </div>

              <div className="tx-right">

                <h2>

                  {tx.type==="Sent"
                    ? "-"
                    : "+"}

                  {tx.amount} USDC

                </h2>

                <div className="tx-actions">

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(tx.hash)
                    }
                  >

                    <Copy size={16}/>

                  </button>

                  <button>

                    <ExternalLink size={16}/>

                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}