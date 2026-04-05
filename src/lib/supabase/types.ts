// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_actions: {
        Row: {
          channel: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          promise_date: string | null
          receivable_id: string
          status: string
          tenant_id: string
          type: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          promise_date?: string | null
          receivable_id: string
          status?: string
          tenant_id: string
          type: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          promise_date?: string | null
          receivable_id?: string
          status?: string
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_actions_receivable_id_fkey"
            columns: ["receivable_id"]
            isOneToOne: false
            referencedRelation: "receivables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_actions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_rules: {
        Row: {
          active: boolean | null
          channel: string
          created_at: string
          days_offset: number
          id: string
          name: string
          template: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          channel: string
          created_at?: string
          days_offset: number
          id?: string
          name: string
          template?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          channel?: string
          created_at?: string
          days_offset?: number
          id?: string
          name?: string
          template?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_attachments: {
        Row: {
          content_type: string
          contract_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          tenant_id: string
        }
        Insert: {
          content_type: string
          contract_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          tenant_id: string
        }
        Update: {
          content_type?: string
          contract_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_attachments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_attachments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          created_at: string
          end_date: string
          id: string
          last_notified_at: string | null
          party_name: string
          start_date: string
          status: string
          tenant_id: string
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          last_notified_at?: string | null
          party_name: string
          start_date: string
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          last_notified_at?: string | null
          party_name?: string
          start_date?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          payment_behavior: string | null
          phone: string | null
          risk_level: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          payment_behavior?: string | null
          phone?: string | null
          risk_level?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          payment_behavior?: string | null
          phone?: string | null
          risk_level?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_certificates: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          name: string
          source: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          name: string
          source: string
          status?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          name?: string
          source?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_certificates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_documents: {
        Row: {
          created_at: string
          document_number: string
          id: string
          issue_date: string
          risk_level: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          document_number: string
          id?: string
          issue_date: string
          risk_level?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          document_number?: string
          id?: string
          issue_date?: string
          risk_level?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_monthly_stats: {
        Row: {
          created_at: string
          id: string
          month_year: string
          revenue: number
          tax: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month_year: string
          revenue?: number
          tax?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month_year?: string
          revenue?: number
          tax?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_monthly_stats_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_taxes: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          name: string
          status: string
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          name: string
          status?: string
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          name?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_taxes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      receivables: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          due_date: string
          id: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          due_date: string
          id?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          due_date?: string
          id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receivables_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          active_alerts: boolean | null
          branding: Json | null
          created_at: string
          enabled_integrations: Json | null
          id: string
          max_file_size_mb: number | null
          max_files_per_contract: number | null
          name: string
          plan: string
          record_limit: number | null
          status: string
          updated_at: string
          user_limit: number | null
        }
        Insert: {
          active_alerts?: boolean | null
          branding?: Json | null
          created_at?: string
          enabled_integrations?: Json | null
          id?: string
          max_file_size_mb?: number | null
          max_files_per_contract?: number | null
          name: string
          plan?: string
          record_limit?: number | null
          status?: string
          updated_at?: string
          user_limit?: number | null
        }
        Update: {
          active_alerts?: boolean | null
          branding?: Json | null
          created_at?: string
          enabled_integrations?: Json | null
          id?: string
          max_file_size_mb?: number | null
          max_files_per_contract?: number | null
          name?: string
          plan?: string
          record_limit?: number | null
          status?: string
          updated_at?: string
          user_limit?: number | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          active: boolean | null
          created_at: string
          events: Json
          id: string
          secret: string
          tenant_id: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          events?: Json
          id?: string
          secret: string
          tenant_id: string
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          events?: Json
          id?: string
          secret?: string
          tenant_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_admin_tenants: { Args: never; Returns: string[] }
      get_auth_user_tenants: { Args: never; Returns: string[] }
      is_platform_admin: { Args: never; Returns: boolean }
      is_tenant_member: { Args: { p_tenant_id: string }; Returns: boolean }
      try_cast_uuid: { Args: { p_in: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: api_keys
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   key_prefix: text (not null)
//   key_hash: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   last_used_at: timestamp with time zone (nullable)
// Table: billing_actions
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   receivable_id: uuid (not null)
//   type: text (not null)
//   channel: text (nullable)
//   status: text (not null, default: 'pending'::text)
//   notes: text (nullable)
//   promise_date: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   created_by: uuid (nullable)
// Table: billing_rules
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   days_offset: integer (not null)
//   channel: text (not null)
//   template: text (nullable)
//   active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: contract_attachments
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   contract_id: uuid (not null)
//   file_name: text (not null)
//   file_path: text (not null)
//   file_size: integer (not null)
//   content_type: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: contracts
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   title: text (not null)
//   party_name: text (not null)
//   start_date: date (not null)
//   end_date: date (not null)
//   status: text (not null, default: 'active'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   value: numeric (nullable, default: 0)
//   last_notified_at: timestamp with time zone (nullable)
// Table: customers
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   document: text (nullable)
//   email: text (nullable)
//   phone: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   risk_level: text (nullable, default: 'low'::text)
//   payment_behavior: text (nullable, default: 'punctual'::text)
// Table: fiscal_certificates
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   status: text (not null, default: 'valid'::text)
//   expires_at: date (not null)
//   source: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: fiscal_documents
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   document_number: text (not null)
//   issue_date: date (not null)
//   status: text (not null, default: 'valid'::text)
//   risk_level: text (nullable, default: 'low'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: fiscal_monthly_stats
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   month_year: text (not null)
//   revenue: numeric (not null, default: 0)
//   tax: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: fiscal_taxes
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   amount: numeric (not null)
//   due_date: date (not null)
//   status: text (not null, default: 'pending'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   full_name: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   phone: text (nullable)
// Table: receivables
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   customer_id: uuid (not null)
//   amount: numeric (not null)
//   due_date: date (not null)
//   status: text (not null, default: 'open'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: roles
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: tenant_users
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   user_id: uuid (not null)
//   role: text (not null, default: 'operator'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   status: text (not null, default: 'active'::text)
// Table: tenants
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   status: text (not null, default: 'active'::text)
//   plan: text (not null, default: 'freemium'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   user_limit: integer (nullable, default: 10)
//   record_limit: integer (nullable, default: 1000)
//   active_alerts: boolean (nullable, default: true)
//   enabled_integrations: jsonb (nullable, default: '[]'::jsonb)
//   branding: jsonb (nullable, default: '{"logo": "", "primary_color": "#000000"}'::jsonb)
//   max_files_per_contract: integer (nullable, default: 5)
//   max_file_size_mb: integer (nullable, default: 10)
// Table: webhooks
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   url: text (not null)
//   events: jsonb (not null, default: '[]'::jsonb)
//   active: boolean (nullable, default: true)
//   secret: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: api_keys
//   PRIMARY KEY api_keys_pkey: PRIMARY KEY (id)
//   FOREIGN KEY api_keys_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: billing_actions
//   FOREIGN KEY billing_actions_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY billing_actions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY billing_actions_receivable_id_fkey: FOREIGN KEY (receivable_id) REFERENCES receivables(id) ON DELETE CASCADE
//   FOREIGN KEY billing_actions_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: billing_rules
//   PRIMARY KEY billing_rules_pkey: PRIMARY KEY (id)
//   FOREIGN KEY billing_rules_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: contract_attachments
//   FOREIGN KEY contract_attachments_contract_id_fkey: FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
//   PRIMARY KEY contract_attachments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contract_attachments_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: contracts
//   PRIMARY KEY contracts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contracts_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: customers
//   PRIMARY KEY customers_pkey: PRIMARY KEY (id)
//   FOREIGN KEY customers_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: fiscal_certificates
//   PRIMARY KEY fiscal_certificates_pkey: PRIMARY KEY (id)
//   FOREIGN KEY fiscal_certificates_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: fiscal_documents
//   PRIMARY KEY fiscal_documents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY fiscal_documents_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: fiscal_monthly_stats
//   PRIMARY KEY fiscal_monthly_stats_pkey: PRIMARY KEY (id)
//   FOREIGN KEY fiscal_monthly_stats_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
//   UNIQUE fiscal_monthly_stats_tenant_id_month_year_key: UNIQUE (tenant_id, month_year)
// Table: fiscal_taxes
//   PRIMARY KEY fiscal_taxes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY fiscal_taxes_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: receivables
//   FOREIGN KEY receivables_customer_id_fkey: FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
//   PRIMARY KEY receivables_pkey: PRIMARY KEY (id)
//   FOREIGN KEY receivables_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: roles
//   UNIQUE roles_name_key: UNIQUE (name)
//   PRIMARY KEY roles_pkey: PRIMARY KEY (id)
// Table: tenant_users
//   PRIMARY KEY tenant_users_pkey: PRIMARY KEY (id)
//   FOREIGN KEY tenant_users_role_fkey: FOREIGN KEY (role) REFERENCES roles(name) ON UPDATE CASCADE
//   FOREIGN KEY tenant_users_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
//   UNIQUE tenant_users_tenant_id_user_id_key: UNIQUE (tenant_id, user_id)
//   FOREIGN KEY tenant_users_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: tenants
//   PRIMARY KEY tenants_pkey: PRIMARY KEY (id)
// Table: webhooks
//   PRIMARY KEY webhooks_pkey: PRIMARY KEY (id)
//   FOREIGN KEY webhooks_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: api_keys
//   Policy "API keys access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: billing_actions
//   Policy "Billing actions access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: billing_rules
//   Policy "Billing rules access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: contract_attachments
//   Policy "contract_attachments access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: contracts
//   Policy "Contracts access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: customers
//   Policy "Customers access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: fiscal_certificates
//   Policy "Fiscal certificates access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: fiscal_documents
//   Policy "Fiscal docs access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: fiscal_monthly_stats
//   Policy "Fiscal stats access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: fiscal_taxes
//   Policy "Fiscal taxes access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: profiles
//   Policy "Profiles select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((id = auth.uid()) OR (id IN ( SELECT tenant_users.user_id    FROM tenant_users   WHERE (tenant_users.tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants)))) OR is_platform_admin())
//   Policy "Users can update own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
//   Policy "Users can view own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: receivables
//   Policy "Receivables access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))
// Table: roles
//   Policy "roles_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: tenant_users
//   Policy "tenant_users_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_admin_tenants() AS get_auth_user_admin_tenants))
//   Policy "tenant_users_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (tenant_id IN ( SELECT get_auth_user_admin_tenants() AS get_auth_user_admin_tenants))
//   Policy "tenant_users_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants)) OR is_platform_admin())
//   Policy "tenant_users_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((tenant_id IN ( SELECT get_auth_user_admin_tenants() AS get_auth_user_admin_tenants)) OR is_platform_admin())
// Table: tenants
//   Policy "Tenant access" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants)) OR is_platform_admin())
//   Policy "Tenant delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_platform_admin()
//   Policy "Tenant insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_platform_admin()
//   Policy "Tenant update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((id IN ( SELECT get_auth_user_admin_tenants() AS get_auth_user_admin_tenants)) OR is_platform_admin())
// Table: webhooks
//   Policy "Webhooks access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (tenant_id IN ( SELECT get_auth_user_tenants() AS get_auth_user_tenants))

// --- DATABASE FUNCTIONS ---
// FUNCTION get_auth_user_admin_tenants()
//   CREATE OR REPLACE FUNCTION public.get_auth_user_admin_tenants()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role = 'admin';
//   $function$
//   
// FUNCTION get_auth_user_tenants()
//   CREATE OR REPLACE FUNCTION public.get_auth_user_tenants()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid();
//   $function$
//   
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     new_tenant_id uuid;
//   BEGIN
//     INSERT INTO public.profiles (id, email, full_name, phone)
//     VALUES (
//       NEW.id, 
//       NEW.email, 
//       NEW.raw_user_meta_data->>'full_name',
//       NEW.raw_user_meta_data->>'phone'
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       full_name = EXCLUDED.full_name,
//       phone = EXCLUDED.phone;
//   
//     IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL AND NEW.raw_user_meta_data->>'company_name' <> '' THEN
//       new_tenant_id := gen_random_uuid();
//       
//       INSERT INTO public.tenants (id, name, status, plan)
//       VALUES (new_tenant_id, NEW.raw_user_meta_data->>'company_name', 'active', 'freemium');
//   
//       INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
//       VALUES (new_tenant_id, NEW.id, 'admin', 'active')
//       ON CONFLICT (tenant_id, user_id) DO NOTHING;
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION is_platform_admin()
//   CREATE OR REPLACE FUNCTION public.is_platform_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1
//       FROM tenant_users tu
//       JOIN tenants t ON tu.tenant_id = t.id
//       WHERE tu.user_id = auth.uid()
//         AND tu.role = 'admin'
//         AND t.name ILIKE 'Planettaweb%'
//     );
//   $function$
//   
// FUNCTION is_tenant_member(uuid)
//   CREATE OR REPLACE FUNCTION public.is_tenant_member(p_tenant_id uuid)
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF p_tenant_id IS NULL THEN RETURN false; END IF;
//     RETURN EXISTS (
//       SELECT 1 FROM public.tenant_users
//       WHERE user_id = auth.uid() AND tenant_id = p_tenant_id
//     );
//   END;
//   $function$
//   
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//   
// FUNCTION try_cast_uuid(text)
//   CREATE OR REPLACE FUNCTION public.try_cast_uuid(p_in text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     RETURN p_in::uuid;
//   EXCEPTION WHEN OTHERS THEN
//     RETURN NULL;
//   END;
//   $function$
//   

// --- INDEXES ---
// Table: fiscal_monthly_stats
//   CREATE UNIQUE INDEX fiscal_monthly_stats_tenant_id_month_year_key ON public.fiscal_monthly_stats USING btree (tenant_id, month_year)
// Table: roles
//   CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name)
// Table: tenant_users
//   CREATE UNIQUE INDEX tenant_users_tenant_id_user_id_key ON public.tenant_users USING btree (tenant_id, user_id)

