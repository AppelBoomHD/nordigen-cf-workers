export type GenerateTokenResponse = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};

/**
 * A Nordigen Institution (Bank)
 */
export type Institution = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
};

/**
 * A bank account in any bank
 * Please note that you might only get the account IBAN without any further information
 */
export type BankAccount = {
  iban?: string;

  resourceId: string;
  currency: string;
  ownerName: string; // Name of the account owner, e.g. "John Doe"
  product?: string;
  cashAccountType: string;
  name?: string; // Account name, e.g. "Main Account"
};

/**
 * An End User Agreement
 */
export type EndUserAgreement = {
  id: string;
  created: Date;
  accepted: Date | null;
  max_historical_days: number;
  access_valid_for_days: number;
  enduser_id: string;
  aspsp_id: string;
};

/**
 * Nordigen Requisition
 */
export type Requisition = {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institution_id: string;
  agreement: string;
  reference: string;
  accounts: string[];
  user_language: string;
  link: string;
  ssn: string;
  account_selection: boolean;
  redirect_immediate: boolean;
};

export type AmountValue = {
  currency: string;
  amount: string;
};

/**
 * A single account balance
 */
export type Balance = {
  balanceAmount: AmountValue;
  balanceType: "closingBooked" | "expected";
  referenceDate: string; // Format YYYY-MM-DD
};

/**
 * Balance data from the Nordigen API
 */
export type BalanceData = {
  balances: Balance[];
};

/**
 * A financial transaction.
 */
export type BookedTransaction = {
  /**
   * Might be used by the financial institution to transport additional transaction related information.
   */
  additionalInformation?: string;
  /**
   * Is used if and only if the bookingStatus entry equals "information".
   */
  additionalInformationStructured?: string;
  /**
   * This is the balance after this transaction. Recommended balance type is interimBooked.
   */
  balanceAfterTransaction?: Balance;
  /**
   * cSpell:disable
   * Bank transaction code as used by the financial institution and using the sub elements of this structured code defined by ISO20022.
   * For standing order reports the following codes are applicable:
   * "PMNT-ICDT-STDO" for credit transfers,
   * "PMNT-IRCT-STDO" for instant credit transfers,
   * "PMNT-ICDT-XBST" for cross-border credit transfers,
   * "PMNT-IRCT-XBST" for cross-border real time credit transfers,
   * "PMNT-MCOP-OTHR" for specific standing orders which have a dynamical amount to move left funds e.g. on month end to a saving account.
   * cSpell:enable
   */
  bankTransactionCode?: string;
  /**
   * The date when an entry is posted to an account on the financial institutions books.
   */
  bookingDate: string;
  /**
   * The date and time when an entry is posted to an account on the financial institutions books.
   */
  bookingDateTime?: string;
  /**
   * Identification of a Cheque.
   */
  checkId?: string;
  /**
   * The account reference of the creditor. Required if the transaction is a credit.
   */
  creditorAccount?: AccountReference;
  /**
   * BICFI code of the creditor agent.
   */
  creditorAgent?: string;
  /**
   * Identification of Creditors, e.g. a SEPA Creditor ID.
   */
  creditorId?: string;
  /**
   * Name of the creditor if a "Debited" transaction.
   */
  creditorName?: string;
  /**
   * An array of exchange rates used in currency exchange.
   */
  currencyExchange?: ReportExchangeRate[];
  /**
   * The account reference of the debtor. Required if the transaction is a debit.
   */
  debtorAccount?: AccountReference;
  /**
   * BICFI code of the debtor agent.
   */
  debtorAgent?: string;
  /**
   * Name of the debtor if a "Credited" transaction.
   */
  debtorName?: string;
  /**
   * Unique end to end ID.
   */
  endToEndId?: string;
  /**
   * Is the identification of the transaction as used for reference given by financial institution.
   */
  entryReference?: string;
  /**
   * Transaction identifier given by Nordigen.
   */
  internalTransactionId: string;
  /**
   * Identification of Mandates, e.g. a SEPA Mandate ID.
   */
  mandateId?: string;
  /**
   * Merchant category code as defined by card issuer.
   */
  merchantCategoryCode?: string;
  /**
   * Proprietary bank transaction code as used within a community or within an financial institution.
   */
  proprietaryBankTransactionCode?: string;
  /**
   * The purpose code of the transaction. Required if the transaction is a credit.
   */
  purposeCode?: PurposeCode;
  /**
   * Reference as contained in the structured remittance reference structure.
   */
  remittanceInformationStructured?: string;
  /**
   * An array of structured remittance reference structures.
   */
  remittanceInformationStructuredArray?: Remittance[];

  /**
   * Reference as contained in the unstructured remittance reference structure.
   */
  remittanceInformationUnstructured?: string;

  /**
   * Reference as contained in the unstructured remittance reference structure.
   */
  remittanceInformationUnstructuredArray?: string[];

  /**
   * The amount of the transaction as billed to the account.
   */
  transactionAmount: Amount;

  /**
   * Unique transaction identifier given by financial institution.
   */
  transactionId?: string;

  /**
   * Identification of the ultimate creditor.
   */
  ultimateCreditor?: string;

  /**
   * Identification of the ultimate debtor.
   */
  ultimateDebtor?: string;

  /**
   * The Date at which assets become available to the account owner in case of a credit.
   */
  valueDate?: string;

  /**
   * The date and time at which assets become available to the account owner in case of a credit.
   */
  valueDateTime?: string;
};

interface AccountReference {
  iban: string;
}

interface ReportExchangeRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
}

interface Amount {
  amount: number;
  currency: string;
}

interface PurposeCode {
  code: string;
  issuer: string;
}

interface Remittance {
  reference: string;
}

export type PendingTransaction = Omit<
  BookedTransaction,
  "bookingDate" | "bookingDateTime"
>;

/**
 * Data returned by the transaction endpoint
 */
export type TransactionData = {
  transactions: {
    booked: BookedTransaction[];
    pending: PendingTransaction[];
  };
};

/**
 * Data returned by the account detail endpoint
 * You will most likely get all information available in the "BankAccount" type here
 */
export type AccountDetailData = {
  account: BankAccount;
};
