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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advancement_tiles: {
        Row: {
          comment: string | null
          created_at: string | null
          diagnostic_id: string
          id: string
          relevance: string | null
          status: string | null
          tile_key: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          diagnostic_id: string
          id?: string
          relevance?: string | null
          status?: string | null
          tile_key: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          diagnostic_id?: string
          id?: string
          relevance?: string | null
          status?: string | null
          tile_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advancement_tiles_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          device_type: string | null
          diagnostic_id: string | null
          duration_ms: number | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          diagnostic_id?: string | null
          duration_ms?: number | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          diagnostic_id?: string | null
          duration_ms?: number | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dg_responses: {
        Row: {
          created_at: string | null
          dg1_governance: string
          dg2_budget: string
          dg3_roi_horizon: string
          dg4_main_benefit: string
          dg5_means_score: number
          diagnostic_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          dg1_governance: string
          dg2_budget: string
          dg3_roi_horizon: string
          dg4_main_benefit: string
          dg5_means_score: number
          diagnostic_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          dg1_governance?: string
          dg2_budget?: string
          dg3_roi_horizon?: string
          dg4_main_benefit?: string
          dg5_means_score?: number
          diagnostic_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dg_responses_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: true
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_sections: {
        Row: {
          content_json: Json | null
          created_at: string | null
          diagnostic_id: string
          generated_by_ai: boolean | null
          id: string
          last_edited_by: string | null
          section_key: string
          section_number: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content_json?: Json | null
          created_at?: string | null
          diagnostic_id: string
          generated_by_ai?: boolean | null
          id?: string
          last_edited_by?: string | null
          section_key: string
          section_number: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content_json?: Json | null
          created_at?: string | null
          diagnostic_id?: string
          generated_by_ai?: boolean | null
          id?: string
          last_edited_by?: string | null
          section_key?: string
          section_number?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_sections_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_sections_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          analysis_step: string | null
          analyst_id: string | null
          client_user_id: string | null
          created_at: string | null
          dg_token: string | null
          id: string
          organization_id: string
          restitution_date: string | null
          status: string | null
          survey_distinguish_populations: boolean | null
          survey_message: string | null
          survey_target_count: number | null
          survey_token: string | null
          unlocked_at: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_step?: string | null
          analyst_id?: string | null
          client_user_id?: string | null
          created_at?: string | null
          dg_token?: string | null
          id?: string
          organization_id: string
          restitution_date?: string | null
          status?: string | null
          survey_distinguish_populations?: boolean | null
          survey_message?: string | null
          survey_target_count?: number | null
          survey_token?: string | null
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_step?: string | null
          analyst_id?: string | null
          client_user_id?: string | null
          created_at?: string | null
          dg_token?: string | null
          id?: string
          organization_id?: string
          restitution_date?: string | null
          status?: string | null
          survey_distinguish_populations?: boolean | null
          survey_message?: string | null
          survey_target_count?: number | null
          survey_token?: string | null
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostics_analyst_id_fkey"
            columns: ["analyst_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostics_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          diagnostic_id: string
          id: string
          step_change: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          diagnostic_id: string
          id?: string
          step_change?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          diagnostic_id?: string
          id?: string
          step_change?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          journal_entry_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          journal_entry_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          journal_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_replies_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          diagnostic_id: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          diagnostic_id: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          diagnostic_id?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          headcount_range: string | null
          id: string
          name: string
          number_of_sites: number | null
          revenue_range: string | null
          rse_start_year: number | null
          sector_naf: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          headcount_range?: string | null
          id?: string
          name: string
          number_of_sites?: number | null
          revenue_range?: string | null
          rse_start_year?: number | null
          sector_naf?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          headcount_range?: string | null
          id?: string
          name?: string
          number_of_sites?: number | null
          revenue_range?: string | null
          rse_start_year?: number | null
          sector_naf?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          photo_url: string | null
          role: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_id?: string | null
          photo_url?: string | null
          role?: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          photo_url?: string | null
          role?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          block: number
          created_at: string | null
          diagnostic_id: string
          id: string
          question_key: string
          response_json: Json | null
          response_text: string | null
          response_value: number | null
          updated_at: string | null
        }
        Insert: {
          block: number
          created_at?: string | null
          diagnostic_id: string
          id?: string
          question_key: string
          response_json?: Json | null
          response_text?: string | null
          response_value?: number | null
          updated_at?: string | null
        }
        Update: {
          block?: number
          created_at?: string | null
          diagnostic_id?: string
          id?: string
          question_key?: string
          response_json?: Json | null
          response_text?: string | null
          response_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_access: {
        Row: {
          created_at: string | null
          diagnostic_id: string
          id: string
          invited_by: string
          invited_email: string
          revoked: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          diagnostic_id: string
          id?: string
          invited_by: string
          invited_email: string
          revoked?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          diagnostic_id?: string
          id?: string
          invited_by?: string
          invited_email?: string
          revoked?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_access_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_access_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string | null
          diagnostic_id: string
          fingerprint: string | null
          id: string
          population: string | null
          s1: number
          s10_verbatim: string | null
          s2: number
          s3: number
          s4: number
          s5: number
          s6: number
          s7: number
          s8: number
          s9_profile: string
        }
        Insert: {
          created_at?: string | null
          diagnostic_id: string
          fingerprint?: string | null
          id?: string
          population?: string | null
          s1: number
          s10_verbatim?: string | null
          s2: number
          s3: number
          s4: number
          s5: number
          s6: number
          s7: number
          s8: number
          s9_profile: string
        }
        Update: {
          created_at?: string | null
          diagnostic_id?: string
          fingerprint?: string | null
          id?: string
          population?: string | null
          s1?: number
          s10_verbatim?: string | null
          s2?: number
          s3?: number
          s4?: number
          s5?: number
          s6?: number
          s7?: number
          s8?: number
          s9_profile?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_diagnostic_participant: { Args: { d_id: string }; Returns: boolean }
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
