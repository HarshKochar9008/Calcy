import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}





export interface ScholarshipPool {
  application_deadline: u64;
  creator: string;
  current_balance: i128;
  distribution_deadline: u64;
  is_active: boolean;
  max_scholarship_amount: i128;
  min_scholarship_amount: i128;
  token: string;
  total_goal: i128;
}


export interface StudentApplication {
  academic_level: string;
  application_timestamp: u64;
  essay_hash: string;
  field_of_study: string;
  financial_need_score: i128;
  gpa: i128;
  is_approved: boolean;
  name: string;
  scholarship_amount: i128;
  student_address: string;
}


export interface Donor {
  address: string;
  contribution_count: u32;
  total_contributed: i128;
}

export const Errors = {
  1: {message:"InvalidAmount"},
  2: {message:"InvalidScholarshipRange"},
  3: {message:"InvalidDeadline"},
  4: {message:"PoolNotActive"},
  5: {message:"ApplicationDeadlinePassed"},
  6: {message:"InvalidApplicationData"},
  7: {message:"AlreadyApplied"},
  8: {message:"Unauthorized"},
  9: {message:"ApplicationsStillOpen"},
  10: {message:"DistributionNotReady"},
  11: {message:"PoolNotInitialized"}
}

export interface Client {
  /**
   * Construct and simulate a init_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize a new scholarship pool
   */
  init_pool: ({creator, token, total_goal, max_scholarship_amount, min_scholarship_amount, application_deadline, distribution_deadline}: {creator: string, token: string, total_goal: i128, max_scholarship_amount: i128, min_scholarship_amount: i128, application_deadline: u64, distribution_deadline: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a donate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Donate to scholarship pool
   */
  donate: ({from, amount}: {from: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a apply_for_scholarship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Apply for scholarship
   */
  apply_for_scholarship: ({student, name, academic_level, field_of_study, gpa, financial_need_score, essay_hash}: {student: string, name: string, academic_level: string, field_of_study: string, gpa: i128, financial_need_score: i128, essay_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a approve_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Approve scholarship applications (only pool creator)
   */
  approve_scholarships: ({creator}: {creator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a distribute_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Distribute scholarships to approved students
   */
  distribute_scholarships: ({creator}: {creator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current pool state
   */
  get_pool: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<ScholarshipPool>>>

  /**
   * Construct and simulate a get_pool_opt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current pool state (returns Option for backward compatibility)
   */
  get_pool_opt: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<ScholarshipPool>>>

  /**
   * Construct and simulate a get_application transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get student application
   */
  get_application: ({student}: {student: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<StudentApplication>>>

  /**
   * Construct and simulate a get_all_applications transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all applications
   */
  get_all_applications: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<StudentApplication>>>

  /**
   * Construct and simulate a get_donor transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get donor information
   */
  get_donor: ({donor}: {donor: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Donor>>>

  /**
   * Construct and simulate a get_pool_stats transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get pool statistics
   */
  get_pool_stats: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<readonly [u32, u32, u32]>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAD1NjaG9sYXJzaGlwUG9vbAAAAAAJAAAAAAAAABRhcHBsaWNhdGlvbl9kZWFkbGluZQAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAPY3VycmVudF9iYWxhbmNlAAAAAAsAAAAAAAAAFWRpc3RyaWJ1dGlvbl9kZWFkbGluZQAAAAAAAAYAAAAAAAAACWlzX2FjdGl2ZQAAAAAAAAEAAAAAAAAAFm1heF9zY2hvbGFyc2hpcF9hbW91bnQAAAAAAAsAAAAAAAAAFm1pbl9zY2hvbGFyc2hpcF9hbW91bnQAAAAAAAsAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAKdG90YWxfZ29hbAAAAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAElN0dWRlbnRBcHBsaWNhdGlvbgAAAAAACgAAAAAAAAAOYWNhZGVtaWNfbGV2ZWwAAAAAABAAAAAAAAAAFWFwcGxpY2F0aW9uX3RpbWVzdGFtcAAAAAAAAAYAAAAAAAAACmVzc2F5X2hhc2gAAAAAABAAAAAAAAAADmZpZWxkX29mX3N0dWR5AAAAAAAQAAAAAAAAABRmaW5hbmNpYWxfbmVlZF9zY29yZQAAAAsAAAAAAAAAA2dwYQAAAAALAAAAAAAAAAtpc19hcHByb3ZlZAAAAAABAAAAAAAAAARuYW1lAAAAEAAAAAAAAAASc2Nob2xhcnNoaXBfYW1vdW50AAAAAAALAAAAAAAAAA9zdHVkZW50X2FkZHJlc3MAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAABURvbm9yAAAAAAAAAwAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAABJjb250cmlidXRpb25fY291bnQAAAAAAAQAAAAAAAAAEXRvdGFsX2NvbnRyaWJ1dGVkAAAAAAAACw==",
        "AAAAAAAAACFJbml0aWFsaXplIGEgbmV3IHNjaG9sYXJzaGlwIHBvb2wAAAAAAAAJaW5pdF9wb29sAAAAAAAABwAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAACnRvdGFsX2dvYWwAAAAAAAsAAAAAAAAAFm1heF9zY2hvbGFyc2hpcF9hbW91bnQAAAAAAAsAAAAAAAAAFm1pbl9zY2hvbGFyc2hpcF9hbW91bnQAAAAAAAsAAAAAAAAAFGFwcGxpY2F0aW9uX2RlYWRsaW5lAAAABgAAAAAAAAAVZGlzdHJpYnV0aW9uX2RlYWRsaW5lAAAAAAAABgAAAAEAAAPpAAAABAAAAAM=",
        "AAAAAAAAABpEb25hdGUgdG8gc2Nob2xhcnNoaXAgcG9vbAAAAAAABmRvbmF0ZQAAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAABVBcHBseSBmb3Igc2Nob2xhcnNoaXAAAAAAAAAVYXBwbHlfZm9yX3NjaG9sYXJzaGlwAAAAAAAABwAAAAAAAAAHc3R1ZGVudAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAOYWNhZGVtaWNfbGV2ZWwAAAAAABAAAAAAAAAADmZpZWxkX29mX3N0dWR5AAAAAAAQAAAAAAAAAANncGEAAAAACwAAAAAAAAAUZmluYW5jaWFsX25lZWRfc2NvcmUAAAALAAAAAAAAAAplc3NheV9oYXNoAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAADRBcHByb3ZlIHNjaG9sYXJzaGlwIGFwcGxpY2F0aW9ucyAob25seSBwb29sIGNyZWF0b3IpAAAAFGFwcHJvdmVfc2Nob2xhcnNoaXBzAAAAAQAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAACxEaXN0cmlidXRlIHNjaG9sYXJzaGlwcyB0byBhcHByb3ZlZCBzdHVkZW50cwAAABdkaXN0cmlidXRlX3NjaG9sYXJzaGlwcwAAAAABAAAAAAAAAAdjcmVhdG9yAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAABZHZXQgY3VycmVudCBwb29sIHN0YXRlAAAAAAAIZ2V0X3Bvb2wAAAAAAAAAAQAAA+kAAAfQAAAAD1NjaG9sYXJzaGlwUG9vbAAAAAAD",
        "AAAAAAAAAEJHZXQgY3VycmVudCBwb29sIHN0YXRlIChyZXR1cm5zIE9wdGlvbiBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSkAAAAAAAxnZXRfcG9vbF9vcHQAAAAAAAAAAQAAA+gAAAfQAAAAD1NjaG9sYXJzaGlwUG9vbAA=",
        "AAAAAAAAABdHZXQgc3R1ZGVudCBhcHBsaWNhdGlvbgAAAAAPZ2V0X2FwcGxpY2F0aW9uAAAAAAEAAAAAAAAAB3N0dWRlbnQAAAAAEwAAAAEAAAPoAAAH0AAAABJTdHVkZW50QXBwbGljYXRpb24AAA==",
        "AAAAAAAAABRHZXQgYWxsIGFwcGxpY2F0aW9ucwAAABRnZXRfYWxsX2FwcGxpY2F0aW9ucwAAAAAAAAABAAAD6gAAB9AAAAASU3R1ZGVudEFwcGxpY2F0aW9uAAA=",
        "AAAAAAAAABVHZXQgZG9ub3IgaW5mb3JtYXRpb24AAAAAAAAJZ2V0X2Rvbm9yAAAAAAAAAQAAAAAAAAAFZG9ub3IAAAAAAAATAAAAAQAAA+gAAAfQAAAABURvbm9yAAAA",
        "AAAAAAAAABNHZXQgcG9vbCBzdGF0aXN0aWNzAAAAAA5nZXRfcG9vbF9zdGF0cwAAAAAAAAAAAAEAAAPtAAAAAwAAAAQAAAAEAAAABA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACwAAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAEAAAAAAAAAF0ludmFsaWRTY2hvbGFyc2hpcFJhbmdlAAAAAAIAAAAAAAAAD0ludmFsaWREZWFkbGluZQAAAAADAAAAAAAAAA1Qb29sTm90QWN0aXZlAAAAAAAABAAAAAAAAAAZQXBwbGljYXRpb25EZWFkbGluZVBhc3NlZAAAAAAAAAUAAAAAAAAAFkludmFsaWRBcHBsaWNhdGlvbkRhdGEAAAAAAAYAAAAAAAAADkFscmVhZHlBcHBsaWVkAAAAAAAHAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAIAAAAAAAAABVBcHBsaWNhdGlvbnNTdGlsbE9wZW4AAAAAAAAJAAAAAAAAABREaXN0cmlidXRpb25Ob3RSZWFkeQAAAAoAAAAAAAAAElBvb2xOb3RJbml0aWFsaXplZAAAAAAACw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    init_pool: this.txFromJSON<Result<u32>>,
        donate: this.txFromJSON<Result<void>>,
        apply_for_scholarship: this.txFromJSON<Result<void>>,
        approve_scholarships: this.txFromJSON<Result<void>>,
        distribute_scholarships: this.txFromJSON<Result<void>>,
        get_pool: this.txFromJSON<Result<ScholarshipPool>>,
        get_pool_opt: this.txFromJSON<Option<ScholarshipPool>>,
        get_application: this.txFromJSON<Option<StudentApplication>>,
        get_all_applications: this.txFromJSON<Array<StudentApplication>>,
        get_donor: this.txFromJSON<Option<Donor>>,
        get_pool_stats: this.txFromJSON<readonly [u32, u32, u32]>
  }
}