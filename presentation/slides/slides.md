**Container Platforms**


---
**Pivotal Cloud Foundry**

PCF is a **P**latform **a**s **a** **S**ervice offering by Pivotal

 
*(an enterprise offering of the Cloud Foundry Foundation's open source platfor, along with IBM, SAP & others )*

===

* PCF can be hosted on any public cloud/private data centers.
* Handles operational complexity such as O.S patching & updates being by the platform without app down-times.
* Provides scaling, monitoring, self-healing, logging & metrics.
* Uses build-packs to reduce risk, app setup complexity; increase security providing auditing features.
* Manages networking such as app routing, TLS termination
 
===

* Supports account isolation & control using org, space & roles with RBAC
* Provides build-packs for most languages & deployment types
* Provides easy to use bindable services such as SSO, Databases, Caches, MQs
* Can define custom build packs & services to publish in its marketplace
* Uses container technology (just does not expose runtime to )

===

__Upsides__
* Simpler platform to support, central operations team manages infra for whole org
* Better security controls as attack surface is reduced
* Easy onboarding, an app just works with build packs!
* Most features required to productionise an app are build into the platform.

__Downsides__
* Expensive! Pay for Platform & infrastructure.
* Native cloud solutions are a lot more affordable but complex to get such features.
* Need to build app according to it's defined patterns for easy usage.
* Locked into apps, services constructs

---

**Kubernetes**

---

**Kubernetes is**
<br/>
<!-- .slide: style="text-align: justified;"> -->
- open sourced project
- ~~~~~orchestrates~~~~~ ↝ <sup>maintains</sup> required compute, storage & networking for user workloads
- supports containers across multiple hosts
- deploys, maintains & scales applications
- the leading container management platform on public cloud workloads

Note:
Demonstrates PaaS like features with lifecycle management with IaaS like flexibility.
Kubernetes is portable across multiple infrastructure providers deu to its IaaS.
No vendor lock-in to a PaaS or IaaS

No need for orchestration since kubernetes auto targets to maintain a desired state in a deployment 

---

2018 CCNF<sup>*</sup> Annual Report


_companies/organizations manage containers with:_
<!-- .element: style="font-size:50%;" -->

<img src="../images/cncf_survey_graphics-12-1024x658.png" width="70%" height="70%"/>

_*Cloud Native Computing Foundation_
<!-- .element: style="font-size:20%;" -->

===

_Kubernetes Environment vs. Container Environment_
<!-- .element: style="font-size:50%;" -->

<img src="../images/cncf_survey_graphics-13-1024x738.jpg" width="70%" height="70%"/>

_*graph above illustrates where respondents are running Kubernetes vs. where they’re deploying containers_
<!-- .element: style="font-size:20%;" -->
Note:

See https://www.cncf.io/blog/2018/08/29/cncf-survey-use-of-cloud-native-technologies-in-production-has-grown-over-200-percent/
for detailed report

---

**Quick Architecture Overview**  

<br/>

Works with _master_ - _node/worker_ design, with at least one master and multiple compute worker nodes.

The _master_ node maintains desired state in the cluster.

The _worker nodes_ are responsible for providing the Kubernetes runtime.

Note:
The master worker is similar to how Jenkins is structured

The control plane is responsible to bring the cluster/app state to how it was described.
The control plane's control loops will respond to changes in cluster by communicating between the master & 
kubelet processes to make the state of all objects in the system match desired state. 
_More on this later with the Deployment description._

The worker nodes is where all the applications would be running.

---

![Architecture](../images/Chart_02_Kubernetes-Architecture.png)

Note:
The API can be accessed via the kubectl CLI or directly via REST API. The API has authentication, authorization and 
admission control mechanisms, each of which can have a module implementation, like password, plain tokens, JWT
 etc.

Controlling API access: https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/

===

![Master](../images/Chart_03_Kubernetes-Master.png)

Note:
_kube-apiserver_: is the front end for the Kubernetes control plane.
It can be scaled horizontally when HA is needed, there is usually a load balancer distributing traffic to healthy 
kube-apiserver (ex. using HA proxy)

_etcd_: is the consistent key-value store used by Kubernetes's backing store for all cluster data.
This also can be backed up in case of loss of service

_kube-scheduler_: watches for new created pods that are not on a node & assigns a node for them
Factors taken into account for scheduling decisions include individual and collective resource requirements, 
hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload 
interference and deadlines

_kube-controller-manager_: is the component that runs the controllers, they include: 
* node controller for watching nodes
* replication controller responsible for maintaining the correct # of pods
* endpoint controller populates the endpoints object i.e joins Services & Pods
* Service Account & Token Controllers: creates default accounts, API access tokens for new namespaces

===

![Node](../images/Chart_04_Kubernetes-Node.png)

Note:
_kubelet_: a daemon agent that runs on each node in the cluster that ensures that containers are running in a pod.
It receives the PodSpecs & ensure that containers described in the spec are running and healthy

_kube-proxy_: network proxy running on each node, maintains rules to allow network communication from inside or outside 
of a network to a pod.

_container runtime_: software for running containers: docker, containerd, rktlet/rkt, cri-o (container runtime interface 
using open container initiative)

---

**Kubernetes Objects**

Kubernetes uses Objects to represent the state of a cluster, the objects are persisted & they describe:
* what containers are running
* what resources are available to applications
* policies on the applications, such as restart policies, upgrades and fault-tolerance

Kubernetes API & kubectl are the two ways to create, modify or delete objects.

---

**Namespaces**

Namespaces are used to support multiple virtual clusters backed by a single physical cluster.
<br/>
<pre><code lang="shell">
kubectl config set-context --current \
    --namespace={insert-namespace-name-here}
# Validate it
kubectl config view | grep namespace:
</code></pre>

When creating a service with a namespace, it creates a DNS entry in the form:
<pre><code lang="url">
{service-name}.{namespace-name}.svc.cluster.local
</code></pre>

Note:
Names of resources need only be unique in a namespace, but not across namespaces.

---

**Labels & Selectors**

Labels are key/value pairs that are attached to objects,<br/>
used to identify objects & organize them

<pre><code lang="json">
"metadata": {
  "labels": {
    "environment" : "dev",
    "tier" : "frontend"
  }
}
</code></pre>

then

<pre><code lang="shell">
kubectl get pods -l environment=dev,tier=frontend
_or_
kubectl get pods -l 'environment in (dev),tier in (frontend)'
</code></pre>

Note:
Annotations unlike labels, cannot be used to identify and select objects.

Additionally Field Selectors allow you to select Kubernetes resources by a resource field value.
Ex:
kubectl get pods --field-selector status.phase=Running

---

**Kubernetes Pods**

* Pods are the smallest deployed object in Kubernetes object model which can contain one or more containers.
* Pods are scaled horizontally by spinning up multiple Pods via _replication_. This group abstraction is called a Controller.
* Pods can have **init containers** as well as **app containers**.
* Pods provide two kinds of shared resources in a container: **networking** & **storage**.
* Pods are scheduled by the master's scheduler on run on nodes via the kubelet 


Note:
A pod encapsulates an application's container, storage, network IP & other options.
It can encapsulate multiple applications composed of tightly coupled containers which need to share a resource.

Pod networking: each pod has a unique IP address, the constituent containers in a pod share same IP space. Containers can 
communicated with each other using localhost. Outbound traffic is via shared network ports. 

Pod Storage: all containers share the data in the volume. Volumes allow persistent data in pod to survive in case one 
container needs to be restarted.

[The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/)

[Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

---

**Pod Lifecycle**

A given pod's status reflects a high-level summary where it is in its lifecycle.
These are the various possibile phases:

* Pending
* Running
* Succeeded
* Failed
* Unknown 

To monitor a container, a container Probe performs a diagnostic periodically by the kubelet. The kubelet can call 
three types of handlers:

* ExecAction: command inside container, success if exits with status code 0
* TCPSocketAction: TCP check against container's IP address on a port, success if port is open
* HTTPGetAction: HTTP GET on container's IP address on specified port and path, success if HTTP status > 200 & < 400

Kubelet can additionally perform two kinds of probes:

* livenessProbe: indicates if the container is running. If not, the container is killed and pushed through restart policy.
* readinessProbe: indicates if container is ready to serve requests, if failed the controller removes Pod's IP Address 
from all services using the Pod.

---

**Controllers**

Controller can create, manage multiple Pods, handle replication, roll-out, self-healing capabilities at a cluster.

Controllers use a Pod Template that is provided by the user to create the Pods.

<br/>
<pre><code class="yaml">
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
</code></pre>
<br/>
<br/>
<br/>

Note:
If a node fails, the Controller might automatically replace the Pod by scheduling an identical replacement on a 
different Node.

Pod templates are specifications which are included in other objects such as Replication Controllers, Jobs, DaemonSets etc.

Names for template resources should be unique in a cluster

---

**ReplicaSet**

A ReplicaSet's purpose is to maintain a stable set of Pods running at any given time.
A selector is defined along with the number of replicas to maintain & the corresponding Pod Template.
ReplicaSet then creates & deletes Pods as needed.

<pre><code lang="yaml">
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
</code></pre>

---

**Deployments**
 
Deployment controllers provides declarative updates for Pods & ReplicaSets by describing the desired state.
 
<pre><code lang="yaml">
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

</code></pre>

Note:
the _selector_ field determines how the deployment finds the pods to manage


Use cases:
* Create a Deployment to rollout a ReplicaSet
* Declare the enw state of Pods
* Rollback and earlier Deployment revision
* Scale up the Deployment to facilitate more load
* Pause the Deployment
* Clean up older ReplicaSets

Running a deployment:
kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
kubectl rollout status deployment.v1.apps/nginx-deployment
kubectl get deployments
kubectl get rs
kubectl get pods --show-labels
kubectl describe deployments

---

**Services**
Services is an abstraction that define a logical set of Pods & a policy by which to access them.
Kubernetes assigns a service an IP address which is used by Service proxies (kube-proxy).

<pre><code lang="yaml">
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
</code></pre>

Note:
In micro services, this is a common pattern where the front ends service does not care which backend they use 
or should not have to keep track of it themselves.

Since pods come and go in Kubernetes, service is the way pods can communicate with each other

In the example provided the service binds to the selector. It binds the incoming port, to a target port.

When comparing to DNS A records & using round robin for IP resolution, DNS results are frequently cached which causes issues when the A record's values are 
updated frequently. 


---
**Show securing service & exposing pods to a cluster**

https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/


---

**Hands On**
**use https://ngrok.com/ for tests https://www.chenhuijing.com/blog/tunnelling-services-for-exposing-localhost-to-the-web/**
Using the kubectl Command-line
Configuring Pods and Containers
Accessing Applications in a Cluster
Monitoring, Logging, and Debugging
Using TLS


Note:

Get cluster info: 
kubectl cluster-info

Get cluster node status:
kubectl describe node <insert-node-name-here>

Apply a kube manifest:
kubectl apply -f template.yaml

kubectl diff -f template.yaml

Get Pod details:
kubectl get pod
kubectl describe pod {podname}

Best way to learn:
kubectl explain pod,svc etc


Running a deployment:
kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
kubectl rollout status deployment.v1.apps/nginx-deployment
kubectl get deployments
kubectl get rs
kubectl get pods --show-labels
kubectl describe deployments

Updating a deployment:
kubectl --record deployment.apps/nginx-deployment set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1

Rollback a deployment:
kubectl rollout history deployment.v1.apps/nginx-deployment
kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
kubectl rollout undo deployment.v1.apps/nginx-deployment
kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
kubectl get deployment nginx-deployment
kubectl describe deployment nginx-deployment

Scaling:
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80

Pause & Resume layout:
kubectl rollout pause deployment.v1.apps/nginx-deployment
kubectl rollout resume deployment.v1.apps/nginx-deployment

See this to control deployment strategies https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

---