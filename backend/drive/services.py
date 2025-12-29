def has_sufficient_quota(user, new_file_size):
    profile = user.profile 
    return (profile.storage_used + new_file_size) <= profile.storage_limit