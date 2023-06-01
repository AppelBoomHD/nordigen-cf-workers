import {
  AccountDetailData,
  BalanceData,
  EndUserAgreement,
  GenerateTokenResponse,
  Institution,
  Requisition,
  TransactionData,
} from "./types";

/**
 * Unofficial Nordigen API for JavaScript
 *
 * @author vantezzen (https://github.com/vantezzen)
 * @license MIT License
 */
export default class Nordigen {
  /**
   * Secret ID for the Nordigen API
   */
  private readonly secretId: string;

  /**
   * Secret Key for the Nordigen API
   */
  private readonly secretKey: string;

  /**
   * Headers
   */
  private readonly headers: { [key: string]: string };

  /**
   * Endpoint URL to use
   */
  readonly endpoint: string;

  /**
   * Create a new instance of the Nordigen API
   *
   * ### Example (es module)
   * ```js
   * import Nordigen from 'nordigen'
   * const nordigen = new Nordigen();
   * ```
   *
   * @param secretId
   * @param secretKey
   * @param endpoint Endpoint URL for the Nordigen API
   */
  constructor(
    secretId: string,
    secretKey: string,
    endpoint = "https://ob.nordigen.com/api/v2"
  ) {
    this.secretId = secretId;
    this.secretKey = secretKey;
    this.endpoint = endpoint;
    this.headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Nordigen-Node-v2",
    };
  }

  async generateToken() {
    const response = (await this.makeRequest("/token/new/", "POST", {
      secret_id: this.secretId,
      secret_key: this.secretKey,
    })) as GenerateTokenResponse;

    this.headers.Authorization = `Bearer ${response.access}`;
  }

  /**
   * Make an authenticated request to the Nordigen API
   *
   * @param path Relative path to the requested endpoint
   * @param method Method to use
   * @param body Message Body
   * @returns JSON Response
   */
  async makeRequest(
    path: string,
    method = "GET",
    body: Record<string, unknown> | false = false
  ) {
    const request = await fetch(`${this.endpoint}${path}`, {
      method,
      headers: this.headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const response = await request.json();
    return response;
  }

  /**
   * Get a list of ASPSPs (Banks) for a given country
   *
   * @param countryCode Country code to use, e.g. "gb" for Great Britain
   * @returns Array of ASPSPs
   */
  async getInstitutions(countryCode: string) {
    return this.makeRequest(`/institutions/?country=${countryCode}`) as Promise<
      readonly Institution[]
    >;
  }

  /**
   * Create a new end user agreement for a user.
   * Use this step only if you want to specify the length of transaction history you want to retrieve.
   * If you skip this step, by default 90 days of transaction history will be retrieved
   *
   * @param endUserId A unique end-user ID of someone who's using your services, it has to be unique within your solution. Usually, it's UUID;
   * @param aspspId ASPSP ID (Bank ID) to use
   * @param maxHistoricalDays The length of the transaction history to be retrieved
   * @returns End user agreement
   */
  async createEndUserAgreement(
    endUserId: string,
    aspspId: string,
    maxHistoricalDays = 90
  ) {
    const response = (await this.makeRequest("/agreements/enduser/", "POST", {
      enduser_id: endUserId,
      aspsp_id: aspspId,
      max_historical_days: maxHistoricalDays,
    })) as Omit<EndUserAgreement, "created" | "accepted"> & {
      created: string;
      accepted: string | null;
    };

    return {
      ...response,
      created: new Date(response.created),
      accepted: response.accepted ? new Date(response.accepted) : null,
    } as EndUserAgreement;
  }

  /**
   * Create a requisition for a user
   *
   * @param redirect URI where the end user will be redirected after finishing authentication with Institution
   * @param institutionId
   * @param reference Additional layer of unique ID defined by you
   * @param agreements As an array of end user agreement IDs or an empty array if you don't have one
   * @param userLanguage To enforce a language for all end user steps hosted by Nordigen passed as a two-letter country code (ISO 3166). If user_language is not defined a language set in browser will be used to determine language
   * @param accountSelection Enable account selection
   * @returns Requisition answer
   */
  async createRequisition({
    redirect,
    institutionId,
    reference,
    agreement,
    userLanguage,
    accountSelection,
  }: {
    redirect: string;
    institutionId: string;
    reference?: string;
    agreement?: EndUserAgreement;
    userLanguage?: string;
    accountSelection?: boolean;
  }) {
    return (await this.makeRequest("/requisitions/", "POST", {
      redirect,
      institution_id: institutionId,
      reference,
      agreement,
      user_language: userLanguage,
      account_selection: accountSelection,
    })) as Promise<Requisition>;
  }

  /**
   * Get information about a user requisition.
   * This can be used to get a list of all user accounts by getting requisition.accounts
   *
   * @param requisitionId Requisition ID of an existing requistion
   * @returns Requisition info
   */
  async getRequisitionInfo(requisitionId: string) {
    return (await this.makeRequest(
      `/requisitions/${requisitionId}/`
    )) as Promise<Requisition>;
  }

  /**
   * Get a list of all balances an account ID holds
   *
   * @param accountId Account ID to check
   * @returns Balances for the account
   */
  async getAccountBalances(accountId: string) {
    return (await this.makeRequest(
      `/accounts/${accountId}/balances/`
    )) as Promise<BalanceData>;
  }

  /**
   * Get a list of all transactions an account ID holds
   *
   * @param accountId Account ID to check
   * @returns Transactions for the account
   */
  async getAccountTransactions(accountId: string) {
    return (await this.makeRequest(
      `/accounts/${accountId}/transactions/`
    )) as Promise<TransactionData>;
  }

  /**
   * Get account details for an account
   *
   * @param accountId Account ID to check
   * @returns Details for the account
   */
  async getAccountDetails(accountId: string) {
    return (await this.makeRequest(
      `/accounts/${accountId}/details/`
    )) as Promise<AccountDetailData>;
  }
}
