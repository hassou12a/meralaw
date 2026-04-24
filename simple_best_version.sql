-- ✅ 最优最简洁写法 每种各取1500条 精确12000条总量
-- 7种风险类型 × 1500 + flirt1500 = 12000 正好

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
        -- 👉 核心：用CASE把flirt也当成一个单独的分组
        ROW_NUMBER() OVER(
            PARTITION BY
                CASE
                    WHEN is_profile_flirt=1 THEN 'flirt_group'
                    ELSE profile_risk_type
                END
            ORDER BY rand()  -- 随机抽取保证分布均匀
        ) AS rn
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
WHERE rn <= 1500;