-- Create a function to save portfolio feedback
create or replace function save_portfolio_feedback(
  p_portfolio_id uuid,
  p_user_id uuid,
  p_positive_chips uuid[],
  p_negative_chips uuid[],
  p_comment text
) returns void as $$
declare
  v_chip_id uuid;
begin
  -- Insert positive chips
  foreach v_chip_id in array p_positive_chips loop
    -- Insert into portfolio_rating
    insert into portfolio_rating (portfolio_id, feedback_chip_id, user_id, rating_type)
    values (p_portfolio_id, v_chip_id, p_user_id, 'positive');

    -- Update portfolio_rating_counts
    insert into portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
    values (p_portfolio_id, v_chip_id, 1)
    on conflict (portfolio_id, feedback_chip_id)
    do update set count = portfolio_rating_counts.count + 1;
  end loop;

  -- Insert negative chips
  foreach v_chip_id in array p_negative_chips loop
    -- Insert into portfolio_rating
    insert into portfolio_rating (portfolio_id, feedback_chip_id, user_id, rating_type)
    values (p_portfolio_id, v_chip_id, p_user_id, 'negative');

    -- Update portfolio_rating_counts
    insert into portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
    values (p_portfolio_id, v_chip_id, 1)
    on conflict (portfolio_id, feedback_chip_id)
    do update set count = portfolio_rating_counts.count + 1;
  end loop;

  -- Insert comment if provided
  if p_comment is not null and p_comment != '' then
    insert into portfolio_comments (portfolio_id, user_id, content)
    values (p_portfolio_id, p_user_id, p_comment);
  end if;
end;
$$ language plpgsql security definer; 