import React, { useState } from 'react';
import * as apiClient from "../../api-client";
import styles from '../../css/AddCredit.module.css';
import { useLocation } from 'react-router-dom';
const AddCredit = () => {
  //const [amount, setAmount] = useState<number>(10000);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const amountParam = searchParams.get('amount');
  const [amount, setAmount] = useState(amountParam ? parseInt(amountParam) : 10000);
  const handleAddCredit =  (event: React.FormEvent) => {
    event.preventDefault();
   apiClient.createPayment(amount).then((data) => {
     window.location.href = data;
   }).catch((error) => {
     console.error("Failed to create payment:", error);
   });
  };

  return (
    <div className={styles.addCreditcontainer}>
  <h1 className={styles.title}>Add Credit</h1>
  <form onSubmit={handleAddCredit} className={styles.addCreditForm}>
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor="amount">Amount(VND):</label>
      <input
        type="number"
        id="amount"
        min={10000}
        step={1000}
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        className={styles.input}
      />
    </div>
    <button type="submit" className={styles.button}>Add Credit</button>
  </form>
</div>
  );
};

export default AddCredit;