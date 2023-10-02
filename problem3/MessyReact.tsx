interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
/*
 * If dont have any private properties to Props, consider using props: BoxProps
 * Should: const WalletPage: React.FC<Props> = (props: BoxProps) 
 */
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  /*
   * The getPriority function takes blockchain as an argument with the type any. 
   * It's better to use a more specific type, such as a union of blockchain names, for better type safety.  
   */    
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }
  /* 
   * The sortedBalances array is computed using useMemo, but it depends on both balances and prices. 
   * This means that every time either balances or prices change, sortedBalances will be recomputed,   
   * potentially causing unnecessary re-renders.
   */
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // Undefined Variable: 'lhsPriority' should be 'balancePriority'.
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]);
  /*
   * The formattedBalances array is created by mapping over sortedBalances to format the amount property using toFixed(). 
   * This formatting could be done directly when rendering the WalletRow components to avoid creating an intermediate array. 
   * And it is declared but not used
   */
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
  // Anti-pattern: Mapping sortedBalances to rows can be combined into a single loop.
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

// ********************************
//  refactored version of the code
// ********************************

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

const WalletPage: React.FC<Props> = (props: BoxProps) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    const priorityMap: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorityMap[blockchain] || -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance: WalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        const formattedAmount = balance.amount.toFixed();
        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formattedAmount}
          />
        );
      })}
    </div>
  );
};
