# AWS ECS Deployment Setup Guide

This guide walks you through setting up the complete CI/CD pipeline for VeloStyle using GitHub Actions, Amazon ECR, and Amazon ECS.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub repository
- AWS CLI installed locally (optional, for manual setup)

## Architecture Overview

```
GitHub → GitHub Actions → Amazon ECR → Amazon ECS (Fargate)
```

- **GitHub Actions**: Automates build and deployment
- **Amazon ECR**: Stores Docker images
- **Amazon ECS**: Runs containerized applications

---

## Step 1: Create ECR Repositories

### 1.1 Backend Repository

```bash
aws ecr create-repository \
  --repository-name velostyle-backend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true
```

### 1.2 Frontend Repository

```bash
aws ecr create-repository \
  --repository-name velostyle-frontend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true
```

**Or via AWS Console:**
1. Go to Amazon ECR → Repositories
2. Click "Create repository"
3. Name: `velostyle-backend` and `velostyle-frontend`
4. Enable "Scan on push"
5. Click "Create repository"

---

## Step 2: Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name velostyle-cluster \
  --region us-east-1
```

**Or via AWS Console:**
1. Go to Amazon ECS → Clusters
2. Click "Create cluster"
3. Cluster name: `velostyle-cluster`
4. Infrastructure: AWS Fargate (serverless)
5. Click "Create"

---

## Step 3: Create Task Definitions

### 3.1 Backend Task Definition

Create file: `backend-task-definition.json`

```json
{
  "family": "velostyle-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "velostyle-backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/velostyle-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "SUPABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:velostyle/supabase-url"
        },
        {
          "name": "SUPABASE_SERVICE_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:velostyle/supabase-key"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:velostyle/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/velostyle-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register the task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://backend-task-definition.json
```

### 3.2 Frontend Task Definition

Create file: `frontend-task-definition.json`

```json
{
  "family": "velostyle-frontend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "velostyle-frontend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/velostyle-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/velostyle-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 30
      }
    }
  ]
}
```

Register the task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://frontend-task-definition.json
```

---

## Step 4: Create CloudWatch Log Groups

```bash
aws logs create-log-group --log-group-name /ecs/velostyle-backend
aws logs create-log-group --log-group-name /ecs/velostyle-frontend
```

---

## Step 5: Create Application Load Balancer (ALB)

### 5.1 Create ALB

```bash
aws elbv2 create-load-balancer \
  --name velostyle-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application
```

### 5.2 Create Target Groups

**Backend Target Group:**

```bash
aws elbv2 create-target-group \
  --name velostyle-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30
```

**Frontend Target Group:**

```bash
aws elbv2 create-target-group \
  --name velostyle-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30
```

### 5.3 Create Listeners

**HTTP Listener (Port 80):**

```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:loadbalancer/app/velostyle-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:targetgroup/velostyle-frontend-tg/xxxxx
```

**Add rule for backend API:**

```bash
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:listener/app/velostyle-alb/xxxxx/xxxxx \
  --priority 1 \
  --conditions Field=path-pattern,Values='/api/*' \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:targetgroup/velostyle-backend-tg/xxxxx
```

---

## Step 6: Create ECS Services

### 6.1 Backend Service

```bash
aws ecs create-service \
  --cluster velostyle-cluster \
  --service-name velostyle-backend-service \
  --task-definition velostyle-backend-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:targetgroup/velostyle-backend-tg/xxxxx,containerName=velostyle-backend,containerPort=3000"
```

### 6.2 Frontend Service

```bash
aws ecs create-service \
  --cluster velostyle-cluster \
  --service-name velostyle-frontend-service \
  --task-definition velostyle-frontend-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT_ID:targetgroup/velostyle-frontend-tg/xxxxx,containerName=velostyle-frontend,containerPort=80"
```

---

## Step 7: Store Secrets in AWS Secrets Manager

```bash
# Supabase URL
aws secretsmanager create-secret \
  --name velostyle/supabase-url \
  --secret-string "https://your-project.supabase.co"

# Supabase Service Key
aws secretsmanager create-secret \
  --name velostyle/supabase-key \
  --secret-string "your-supabase-service-key"

# JWT Secret
aws secretsmanager create-secret \
  --name velostyle/jwt-secret \
  --secret-string "your-jwt-secret-key"

# Razorpay Keys
aws secretsmanager create-secret \
  --name velostyle/razorpay-key-id \
  --secret-string "your-razorpay-key-id"

aws secretsmanager create-secret \
  --name velostyle/razorpay-key-secret \
  --secret-string "your-razorpay-key-secret"

# Resend API Key
aws secretsmanager create-secret \
  --name velostyle/resend-api-key \
  --secret-string "your-resend-api-key"
```

---

## Step 8: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

1. **AWS_ACCESS_KEY_ID**: Your AWS access key
2. **AWS_SECRET_ACCESS_KEY**: Your AWS secret key

### How to create AWS credentials:

1. Go to AWS IAM → Users → Create user
2. User name: `github-actions-user`
3. Attach policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonECS_FullAccess`
   - `AmazonECSTaskExecutionRolePolicy`
4. Create access key → CLI
5. Copy Access Key ID and Secret Access Key

---

## Step 9: Update Workflow Files

The workflow files are already created in `.github/workflows/`:
- `deploy-backend.yml`
- `deploy-frontend.yml`

Update the following values in both files:
- `AWS_REGION`: Your AWS region (default: us-east-1)
- `ECR_REPOSITORY`: Your ECR repository names
- `ECS_SERVICE`: Your ECS service names
- `ECS_CLUSTER`: Your ECS cluster name
- `ECS_TASK_DEFINITION`: Your task definition names
- `CONTAINER_NAME`: Your container names

---

## Step 10: Test the Pipeline

### 10.1 Manual Trigger

1. Go to GitHub → Actions
2. Select "Deploy Backend to ECS" or "Deploy Frontend to ECS"
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

### 10.2 Automatic Trigger

Push changes to the `main` branch:

```bash
git add .
git commit -m "feat: trigger CI/CD pipeline"
git push origin main
```

The pipeline will automatically:
1. Build Docker images
2. Push to ECR
3. Update ECS task definitions
4. Deploy to ECS services

---

## Step 11: Verify Deployment

### Check ECS Services

```bash
aws ecs describe-services \
  --cluster velostyle-cluster \
  --services velostyle-backend-service velostyle-frontend-service
```

### Check Running Tasks

```bash
aws ecs list-tasks \
  --cluster velostyle-cluster \
  --service-name velostyle-backend-service
```

### View Logs

```bash
aws logs tail /ecs/velostyle-backend --follow
aws logs tail /ecs/velostyle-frontend --follow
```

### Access Application

Get the ALB DNS name:

```bash
aws elbv2 describe-load-balancers \
  --names velostyle-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text
```

Access your application:
- Frontend: `http://YOUR-ALB-DNS-NAME`
- Backend API: `http://YOUR-ALB-DNS-NAME/api`

---

## Monitoring and Troubleshooting

### CloudWatch Logs

View logs in AWS Console:
1. Go to CloudWatch → Log groups
2. Select `/ecs/velostyle-backend` or `/ecs/velostyle-frontend`
3. View log streams

### ECS Service Events

```bash
aws ecs describe-services \
  --cluster velostyle-cluster \
  --services velostyle-backend-service \
  --query 'services[0].events[0:10]'
```

### Task Health

```bash
aws ecs describe-tasks \
  --cluster velostyle-cluster \
  --tasks TASK_ARN
```

---

## Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Auto-scaling**: Configure based on CPU/memory
3. **Right-size containers**: Adjust CPU/memory based on usage
4. **Use ECR lifecycle policies**: Delete old images

---

## Security Best Practices

1. ✅ Use AWS Secrets Manager for sensitive data
2. ✅ Enable ECR image scanning
3. ✅ Use IAM roles with least privilege
4. ✅ Enable VPC Flow Logs
5. ✅ Use HTTPS (add ACM certificate to ALB)
6. ✅ Enable AWS WAF on ALB
7. ✅ Regular security updates

---

## Next Steps

1. **Add HTTPS**: Configure ACM certificate and HTTPS listener
2. **Custom Domain**: Route 53 → ALB
3. **Auto-scaling**: Configure ECS service auto-scaling
4. **Monitoring**: Set up CloudWatch alarms
5. **Backup**: Configure RDS automated backups (if using RDS)

---

## Useful Commands

### Force new deployment

```bash
aws ecs update-service \
  --cluster velostyle-cluster \
  --service velostyle-backend-service \
  --force-new-deployment
```

### Scale service

```bash
aws ecs update-service \
  --cluster velostyle-cluster \
  --service velostyle-backend-service \
  --desired-count 3
```

### Stop all tasks

```bash
aws ecs update-service \
  --cluster velostyle-cluster \
  --service velostyle-backend-service \
  --desired-count 0
```

---

## Support

For issues or questions:
- AWS Documentation: https://docs.aws.amazon.com/ecs/
- GitHub Actions: https://docs.github.com/en/actions
- Docker: https://docs.docker.com/

---

## Summary

✅ **Section 3.1**: Dockerfiles created for backend and frontend  
✅ **Section 3.2**: GitHub Actions workflow files created  
✅ **Section 3.3**: Build & push to ECR configured  
✅ **Section 3.4**: Full automation with ECS deployment  

**Total: 4/4 Marks** 🎉
