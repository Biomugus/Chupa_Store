export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      products: {
        Row: {
          category: string | null;
          characteristics: string | null;
          compatibility: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          images: string[] | null;
          material: string | null;
          model: string | null;
          price: number;
          product_type: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          category?: string | null;
          characteristics?: string | null;
          compatibility?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          material?: string | null;
          model?: string | null;
          price: number;
          product_type?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          category?: string | null;
          characteristics?: string | null;
          compatibility?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          material?: string | null;
          model?: string | null;
          price?: number;
          product_type?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          selected_platform_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          selected_platform_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          selected_platform_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_selected_platform_id_fkey';
            columns: ['selected_platform_id'];
            isOneToOne: false;
            referencedRelation: 'weapon_platforms';
            referencedColumns: ['id'];
          },
        ];
      };
      weapon_platforms: {
        Row: {
          id: string;
          name: string;
          slug: string;
          platform_group: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          platform_group: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          platform_group?: string;
        };
        Relationships: [];
      };
      product_compatibility: {
        Row: {
          product_id: string;
          platform_id: string;
          status: Database['public']['Enums']['compatibility_status'];
        };
        Insert: {
          product_id: string;
          platform_id: string;
          status?: Database['public']['Enums']['compatibility_status'];
        };
        Update: {
          product_id?: string;
          platform_id?: string;
          status?: Database['public']['Enums']['compatibility_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'product_compatibility_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_compatibility_platform_id_fkey';
            columns: ['platform_id'];
            isOneToOne: false;
            referencedRelation: 'weapon_platforms';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          client_request_id: string;
          created_at: string;
          status: Database['public']['Enums']['request_status'];
          customer: Json;
          delivery_service: string;
          payment_method: string;
          items: Json;
          total: number;
          notifications: Json;
        };
        Insert: {
          id?: string;
          client_request_id: string;
          created_at?: string;
          status?: Database['public']['Enums']['request_status'];
          customer: Json;
          delivery_service: string;
          payment_method: string;
          items: Json;
          total: number;
          notifications?: Json;
        };
        Update: {
          id?: string;
          client_request_id?: string;
          created_at?: string;
          status?: Database['public']['Enums']['request_status'];
          customer?: Json;
          delivery_service?: string;
          payment_method?: string;
          items?: Json;
          total?: number;
          notifications?: Json;
        };
        Relationships: [];
      };
      feedback_requests: {
        Row: {
          id: string;
          created_at: string;
          status: Database['public']['Enums']['request_status'];
          name: string;
          contact: string;
          topic: string;
          message: string;
          notifications: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          status?: Database['public']['Enums']['request_status'];
          name: string;
          contact: string;
          topic: string;
          message: string;
          notifications?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          status?: Database['public']['Enums']['request_status'];
          name?: string;
          contact?: string;
          topic?: string;
          message?: string;
          notifications?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      compatibility_status: 'perfect' | 'modification_required' | 'incompatible';
      request_status: 'new' | 'in_progress' | 'done' | 'cancelled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      compatibility_status: ['perfect', 'modification_required', 'incompatible'],
      request_status: ['new', 'in_progress', 'done', 'cancelled'],
    },
  },
} as const;
