import {
  Center,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import StoreItem from "../components/StoreItem";
import { useAppDispatch, useAppSelector } from "../redux/reduxTypedHooks";
import {
  fetchItems,
  getItems,
  getItemsCount,
  getLoadingState,
} from "../redux/ShopSlice";
import Paginator from "../components/Paginator";
import { FetchItemsThunkProps } from "../redux/ShopSlice";
import SigninModal from "../components/SigninModal";

export default function Shop() {
  const { productCategory } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useSearchParams();

  const [category, setCategory] = useState(productCategory);
  const [nameQuery, setNameQuery] = useState(search.get("nameQuery") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(search.get("page")) || 1
  );

  //the flag to identify if the page change in the url caused by browser history backward/forward or the paginator button clicking.
  const [isUrlPageChange, setIsUrlPageChange] = useState(true);

  const dispatch = useAppDispatch();

  const ITEMS_PER_PAGE = 6;
  const limit = ITEMS_PER_PAGE;

  const storeItems = useAppSelector(getItems);
  const itemsCount = useAppSelector(getItemsCount);
  const loadingState = useAppSelector(getLoadingState);
  const totalPages = Math.ceil(itemsCount / limit);

  const fetchItemsArgs: FetchItemsThunkProps = {
    limit,
    category: productCategory,
  };

  if (search.get("nameQuery")) {
    fetchItemsArgs.nameQuery = search.get("nameQuery")!;
  }

  if (search.get("page")) {
    fetchItemsArgs.page = Number(search.get("page"));
  }

  useEffect(() => {
    dispatch(fetchItems(fetchItemsArgs));
  }, []);

  // navigate to the same page will not trigger initial useEffect.
  // Every change of category/nameQuery/paginator should update the url via navigate, so as to properly go back to the previous page.
  // Refetching items only depends on the current url location change.
  useEffect(() => {
    dispatch(fetchItems(fetchItemsArgs));

    setCategory(productCategory || "all");
    setNameQuery(search.get("nameQuery") || "");

    setIsUrlPageChange(true);
    setCurrentPage(Number(search.get("page")) || 1);
    // console.log(location);
  }, [location]);

  // Use isUrlPageChange to ensure that only the currentPage change from paginator can modify the page query in the url. The currentPage change caused by the browser backward/forward will not modify the url again.
  useEffect(() => {
    if (!isUrlPageChange) {
      navigate(`?page=${currentPage}`);
      // setSearch((prev) => ({ ...prev, page: currentPage }));
    }
  }, [currentPage]);

  return (
    <>
      <main>
        <Container width="85%" maxW="90rem" mb={6} p={0}>
          <Flex
            direction={["column", "row"]}
            gap={2}
            mb={3}
            py={4}
            bgColor="white"
            position="sticky"
            top="4.6rem"
            zIndex="10"
          >
            <Select
              w={["100%", "15rem"]}
              value={category}
              onChange={(e) => {
                setNameQuery("");
                setCategory(e.target.value);
                // Changing category will clear nameQuery and paginator
                navigate(`/shop/${e.target.value}`);
              }}
            >
              <option value="all">All</option>
              <option value="sports">Sports</option>
              <option value="canvas">Canvas</option>
              <option value="leather">Leather</option>
            </Select>
            <Spacer />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/shop/${category}?nameQuery=${nameQuery}`);
              }}
            >
              <InputGroup w={["100%", "25rem"]}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.500" />}
                />
                <Input
                  type="text"
                  placeholder="Search"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value.trim())}
                />
              </InputGroup>
            </form>
          </Flex>

          {loadingState === "pending" ? (
            <Center h="20rem">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
              <Text fontSize="xl" ms={6}>
                Loading...
              </Text>
            </Center>
          ) : storeItems.length > 0 ? (
            <SimpleGrid columns={[1, null, 2, 3, 4]} spacing="1.5rem">
              {storeItems.map((item) => (
                <StoreItem key={item.id} {...item} />
              ))}
            </SimpleGrid>
          ) : (
            <Center my={12}>
              <Text fontSize="2xl" fontWeight="bold">
                Empty Results
              </Text>
            </Center>
          )}

          <Center my={24}>
            <Paginator
              totalPages={totalPages}
              slicePages={4}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setIsUrlPageChange={setIsUrlPageChange}
            />
          </Center>

          <SigninModal />
        </Container>
      </main>
    </>
  );
}
