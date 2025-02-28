
## 📸 로고 이미지
![oflix 로고](https://raw.githubusercontent.com/jjungEj/oflix_frontproject/main/src/assets/oflix.png)
## **📌 프로젝트: 재해석한 O!Flix**

🎬 **담당 역할:** 영화 도메인 개발

### **🔹 프로젝트 개요**

O!Flix는 영화 정보를 관리하고 예매할 수 있는 플랫폼으로, 사용자가 원하는 영화를 쉽게 검색하고 관리할 수 있도록 설계되었습니다.

저는 **영화 도메인**을 담당하여 **Spring Boot 기반의 REST API**를 개발하였으며, **영화 등록, 수정, 삭제, 검색, 이미지 업로드 기능**을 구현했습니다.
또한 브랜드 로고 제작도 담당하였습니다.

---

## **🔹 기술 스택**

### **🔹 Backend**

✅ **Spring Boot** - RESTful API 개발

✅ **Spring Data JPA** - 데이터베이스 연동 및 페이징 처리

✅ **Spring Web MVC** - 컨트롤러 및 요청 처리

✅ **Lombok** - 코드 간결화

✅ **Spring Transaction (@Transactional)** - 데이터 일관성 유지

✅ **MultipartFile 처리** - 영화 포스터 및 배너 이미지 업로드

✅ **Spring Validation** - 입력 값 검증

### **🔹 Database**

✅ **MySQL** - 영화 데이터 저장 및 관리

✅ **JPA + QueryDSL (추가 가능)** - 검색 기능 최적화

### **🔹 DevOps & 기타**

✅ **Postman** - API 테스트

✅ **Swagger (추가 가능)** - API 문서 자동화

✅ **Git / GitHub** - 버전 관리

---

## **🔹 구현한 주요 기능**

### 🎥 **1. 영화 관리 기능**

- 영화 **등록, 수정, 삭제, 조회** API 구현
- **페이징 및 정렬 기능** 제공 (`Pageable`)
- 특정 영화 상세 조회 API

### 🔎 **2. 검색 기능**

- **제목, 배우, 감독별 영화 검색 API** 구현
- 검색 결과 **페이징 처리** 적용

### 🖼️ **3. 이미지 업로드 기능**

- `MultipartFile`을 활용한 **영화 포스터 및 스틸컷 업로드**
- 배너 이미지를 등록하여 **홈 화면에 반영 가능**

### 🔗 **4. React 프론트엔드 연동**

- `@CrossOrigin(origins = "http://localhost:5173")` 설정으로 **CORS 문제 해결**
- 클라이언트에서 요청한 데이터를 JSON 형태로 반환

---

## **🔹 프로젝트 결과 및 배운 점**

✅ **영화 관리 API를 완성하고 React 프론트엔드와 연동하여 실제 서비스와 유사한 구조를 구축**

✅ **Spring Data JPA를 활용한 효율적인 데이터 처리 및 페이징 기능 적용**

✅ **파일 업로드 및 이미지 관리를 적용하면서 실무에서 활용 가능한 기능을 구현**

✅ **검색 기능을 통해 QueryDSL 등의 활용 가능성을 고민해볼 기회가 됨**

✅ **API 설계 시, CORS 문제 해결과 클라이언트와의 협업 경험을 쌓음**

---

## **🔹 추가 개선 가능 요소**

🚀 **Swagger 적용** - API 문서 자동화

🚀 **Spring Security + JWT 인증** - 보안 강화

🚀 **Redis 캐싱** - 검색 속도 최적화

🚀 **CI/CD (GitHub Actions, Jenkins)** - 자동 배포 환경 구축

