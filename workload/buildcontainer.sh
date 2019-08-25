eval $(minikube docker-env)
docker build -t node-kube:v1 .
