import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import api from "../lib/api";
import Layout from "../components/Layout";
export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [type, setType] = useState("");
  useEffect(() => {
    api
      .get("/wallet/transactions", { params: type ? { type } : {} })
      .then((r) => setTxs(r.data.transactions));
  }, [type]);
  return (
    <Layout>
      <div className="page-head">
        <div>
          <p className="eyebrow">LEDGER</p>
          <h1>Transactions</h1>
          <p>Review your recent wallet activity.</p>
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All transactions</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.reference}</td>
                <td>
                  <span className={"pill " + tx.type}>{tx.type}</span>
                </td>
                <td>{tx.description || tx.category}</td>
                <td className={tx.type === "credit" ? "credit" : "debit"}>
                  {tx.type === "credit" ? "+" : "-"}₹
                  {tx.amount.toLocaleString("en-IN")}
                </td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
