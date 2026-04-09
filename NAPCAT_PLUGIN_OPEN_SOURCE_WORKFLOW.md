# NapCat Plugin Open Source Workflow

标准流程：

1. 在运行目录外创建独立仓库
2. 只复制源码和必要资源
3. 清理绝对路径、私有配置、日志和状态文件
4. 补齐 `README`、`LICENSE`、`config.example.json`
5. 配置 `release.yml` 和 `update-index.yml`
6. 创建 GitHub 仓库并设置 `INDEX_PAT`
7. 推送主分支和版本 tag
8. 验证 Release 与官方索引 PR
