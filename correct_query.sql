SELECT
    reported_uid,
    report_id,
    tcs_case_id,
    profile_risk_type,
    is_profile_flirt
FROM
(
    SELECT
        reported_uid,
        report_id,
        tcs_case_id,
        profile_risk_type,
        is_profile_flirt,
        -- 对每种profile_risk_type单独编号
        ROW_NUMBER() OVER(PARTITION BY profile_risk_type ORDER BY rand()) as rn_risk,
        -- 对is_profile_flirt=1单独编号
        ROW_NUMBER() OVER(PARTITION BY is_profile_flirt ORDER BY rand()) as rn_flirt
    FROM
        security_dm.app_social_dm_planck_hm_labelling_cases_hf
    WHERE
        date='${date}'
        AND HOUR='23'
        AND moderation_type_name='human'
        AND is_labelled=1
        AND (
            profile_risk_type in (
                '["no_risk"]',
                '["ng_scam"]',
                '["inauthentic_engagemen_traffic_generation"]',
                '["scams_impersonation"]',
                '["promotion_of_physical"]',
                '["scam_finance_investments_crypto"]',
                '["unwanted_adv"]'
            )
            OR is_profile_flirt=1
        )
) t
WHERE
    -- 每种风险类型取1500条
    (profile_risk_type in (
        '["no_risk"]',
        '["ng_scam"]',
        '["inauthentic_engagemen_traffic_generation"]',
        '["scams_impersonation"]',
        '["promotion_of_physical"]',
        '["scam_finance_investments_crypto"]',
        '["unwanted_adv"]'
    ) AND rn_risk <= 1500)

    UNION ALL

    -- is_profile_flirt=1 单独取1500条
    SELECT
        reported_uid,
        report_id,
        tcs_case_id,
        profile_risk_type,
        is_profile_flirt
    FROM
    (
        SELECT
            reported_uid,
            report_id,
            tcs_case_id,
            profile_risk_type,
            is_profile_flirt,
            ROW_NUMBER() OVER(ORDER BY rand()) as rn
        FROM
            security_dm.app_social_dm_planck_hm_labelling_cases_hf
        WHERE
            date='${date}'
            AND HOUR='23'
            AND moderation_type_name='human'
            AND is_labelled=1
            AND is_profile_flirt=1
            -- 排除已经在上面风险类型里取过的数据，避免重复
            AND profile_risk_type NOT IN (
                '["no_risk"]',
                '["ng_scam"]',
                '["inauthentic_engagemen_traffic_generation"]',
                '["scams_impersonation"]',
                '["promotion_of_physical"]',
                '["scam_finance_investments_crypto"]',
                '["unwanted_adv"]'
            )
    ) t2
    WHERE rn <= 1500
;