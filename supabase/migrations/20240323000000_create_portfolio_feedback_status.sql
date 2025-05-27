-- Create portfolio_feedback_status table
create table public.portfolio_feedback_status (
  id uuid not null default gen_random_uuid(),
  portfolio_id uuid not null,
  user_id uuid not null,
  status text not null default 'in_progress',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint portfolio_feedback_status_pkey primary key (id),
  constraint portfolio_feedback_status_portfolio_user_key unique (portfolio_id, user_id),
  constraint portfolio_feedback_status_portfolio_id_fkey foreign key (portfolio_id) references portfolios (id) on delete cascade,
  constraint portfolio_feedback_status_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint portfolio_feedback_status_status_check check (status in ('in_progress', 'completed'))
) TABLESPACE pg_default;

-- Create indexes
create index if not exists idx_portfolio_feedback_status_portfolio_id on public.portfolio_feedback_status using btree (portfolio_id) TABLESPACE pg_default;
create index if not exists idx_portfolio_feedback_status_user_id on public.portfolio_feedback_status using btree (user_id) TABLESPACE pg_default;
create index if not exists idx_portfolio_feedback_status_status on public.portfolio_feedback_status using btree (status) TABLESPACE pg_default;

-- Add updated_at trigger
create trigger update_portfolio_feedback_status_updated_at
  before update on portfolio_feedback_status
  for each row
  execute function update_updated_at_column(); 