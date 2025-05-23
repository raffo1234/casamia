export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent: {
        Row: {
          created_at: string
          email: string
          fullName: string
          id: string
          phone: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          fullName: string
          id?: string
          phone: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          fullName?: string
          id?: string
          phone?: string
          username?: string
        }
        Relationships: []
      }
      company: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          logo_url: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry: {
        Row: {
          created_at: string
          dni: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string
          property_id: string | null
        }
        Insert: {
          created_at?: string
          dni: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone: string
          property_id?: string | null
        }
        Update: {
          created_at?: string
          dni?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      like: {
        Row: {
          created_at: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          property_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      permission: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug?: string
        }
        Relationships: []
      }
      property: {
        Row: {
          bathroom_count: string | null
          bedroom_count: string | null
          company_id: string | null
          created_at: string
          currency: string | null
          delivery_at: string | null
          description: string
          id: string
          location: string | null
          phase: string | null
          price: string | null
          size: string | null
          state: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          bathroom_count?: string | null
          bedroom_count?: string | null
          company_id?: string | null
          created_at?: string
          currency?: string | null
          delivery_at?: string | null
          description: string
          id?: string
          location?: string | null
          phase?: string | null
          price?: string | null
          size?: string | null
          state?: string
          title: string
          type?: string | null
          user_id?: string
        }
        Update: {
          bathroom_count?: string | null
          bedroom_count?: string | null
          company_id?: string | null
          created_at?: string
          currency?: string | null
          delivery_at?: string | null
          description?: string
          id?: string
          location?: string | null
          phase?: string | null
          price?: string | null
          size?: string | null
          state?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      property_image: {
        Row: {
          created_at: string
          id: string
          image_url: string
          property_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          property_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_image_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      role: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      role_permission: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permission_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permission_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
        ]
      }
      typology: {
        Row: {
          bathroom_count: number | null
          bedroom_count: number | null
          created_at: string
          description: string | null
          floor: string | null
          id: string
          image: string | null
          name: string
          price: string
          property_id: string
          size: string
          stock: number | null
        }
        Insert: {
          bathroom_count?: number | null
          bedroom_count?: number | null
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          image?: string | null
          name: string
          price: string
          property_id: string
          size: string
          stock?: number | null
        }
        Update: {
          bathroom_count?: number | null
          bedroom_count?: number | null
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: string
          property_id?: string
          size?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "type_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          image_url: string | null
          last_name: string | null
          name: string | null
          password: string | null
          provider: string | null
          provider_id: string | null
          role_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          name?: string | null
          password?: string | null
          provider?: string | null
          provider_id?: string | null
          role_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          name?: string | null
          password?: string | null
          provider?: string | null
          provider_id?: string | null
          role_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
