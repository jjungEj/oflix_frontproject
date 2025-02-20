import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Image, Text, Button, VStack, HStack, Grid, Container } from "@chakra-ui/react";

function MovieDetailForm() {
  const { movieId } = useParams(); //url에서 movieId 뽑아옴
  const [movie, setMovie] = useState(null); //서버에서 받아온 영화 객체
  const [error, setError] = useState(null);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}`);

      if (!response.ok) {
        throw new Error("영화를 찾을 수 없습니다.");
      }

      const data = await response.json(); //json으로 변환
      setMovie(data); //movie 설정정
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => { //컴포넌트가 렌더링 될 때마다 실행
    fetchMovie(); //이 함수를.....
  }, [movieId]);

  if (error) return <Text color="red" textAlign="center">{error}</Text>;
  if (!movie) return <Text textAlign="center">로딩 중...</Text>;

  return ( //여기에 html코드 작성하는듯
    <Container py={5} centerContent> {/*py->상하단 padding*/}
      <VStack spacing={8} mt={8} width="100%" align="center">

        <HStack align="center" justify="center" spacing={8}>  {/* HStack->가로정렬 VStack->세로정렬 */}
          <Image
            src={movie.images?.find(img => img.imageType === "MAIN")?.imagePath || "https://via.placeholder.com/200"} 
            alt={movie.title}
            boxSize="250px"
            objectFit="contain" //contain으로 해야 이미지를 안 자름
          />
          <VStack align="start" > {/* spacing 속성 뭐가 변하는지 모르겠음 */}
            <Text fontSize="2xl" fontWeight="bold">{movie.title}</Text> {/* 2xl->24px, md->16px */}
            <Text fontSize="md" color="gray.600">{movie.releaseDate} 개봉 | {movie.genre} | {movie.viewAge} 관람가</Text>
            <Text><strong>감독:</strong> {movie.director}</Text>
            <Text><strong>배우:</strong> {movie.actors}</Text>
            <Text><strong>줄거리??</strong></Text>
            <Button colorScheme="gray" size="lg">예매하기</Button>
          </VStack>
        </HStack>
        <Grid templateColumns="repeat(3, 1fr)" gap={4} justifyContent="center">
          {movie.images?.filter(img => img.imageType === "STILL").map(image => (
            <Image 
            key={image.imageId} 
            src={image.imagePath} 
            alt={image.imageName} 
            boxSize="250px" 
            objectFit="contain" 
            borderRadius="md" />
          ))}
        </Grid>


      </VStack>

    </Container>
  );
}

export default MovieDetailForm;