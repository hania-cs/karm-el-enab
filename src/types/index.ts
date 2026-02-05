export interface User {
  id: string;
  name: string;
  email: string;
  farm_name?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'farmer';
}

export interface Equipment {
  id: string;
  name: string;
  description?: string;
  daily_rate: number;
  quantity_available: number;
  is_rented: boolean;  // Add this line
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Plot {
  id: string;
  user_id: string;
  plot_name: string;
  area: number;
  income_last_year: number;
  income_status: 'Good' | 'Fair' | 'Poor';
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  user_id: string;
  equipment_id: string;
  quantity: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  total_cost?: number;
  created_at: string;
  updated_at: string;
  equipment?: Equipment;
  profiles?: User;
}

export interface Booklet {
  id: string;
  title: string;
  preview_text?: string;
  content_text?: string;
  photo_path?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  role: 'admin' | 'farmer' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}