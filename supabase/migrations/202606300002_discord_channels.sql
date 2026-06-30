alter table public.messages
drop constraint if exists messages_channel_check;

alter table public.messages
add constraint messages_channel_check
check (channel in ('general', 'constitution', 'hustlers', 'tax-reaper', 'loans', 'suits-tism'));
