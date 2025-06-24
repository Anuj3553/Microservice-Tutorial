import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

const productFactory = new Factory<Product>()
    .attr("id", faker.number.int({ min: 1, max: 1000 }))
    .attr("name", faker.commerce.productName())
    .attr("description", faker.commerce.productDescription())
    .attr("price", +faker.commerce.price())
    .attr("stock", faker.number.int({ min: 0, max: 100 }));

const mockProduct = (rest: any) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        // stock: faker.number.int({ min: 0, max: 100 })
        ...rest
    }
}

describe("catalogService", () => {
    let repository: ICatalogRepository;

    beforeEach(() => {
        repository = new MockCatalogRepository()
    })

    afterEach(() => {
        repository = {} as MockCatalogRepository;
    })

    describe("createProduct", () => {
        test("should create a product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                stock: faker.number.int({ min: 0, max: 100 })
            })
            const result = await service.createProduct(reqBody)
            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            })

        })

        test("should throw an error with unable to create product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                stock: faker.number.int({ min: 0, max: 100 })
            })

            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() => Promise.resolve({} as Product));

            await expect(service.createProduct(reqBody)).rejects.toThrow(
                "Unable to create product"
            )
        })

        test("should throw an error with product already exists", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                stock: faker.number.int({ min: 0, max: 100 })
            })

            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("product already exists"))
                );

            await expect(service.createProduct(reqBody)).rejects.toThrow(
                "product already exists"
            )
        })
    })

    describe("updateProduct", () => {
        test("should update a product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                stock: faker.number.int({ min: 0, max: 100 }),
                id: faker.number.int({ min: 1, max: 1000 })
            })
            const result = await service.updateProduct(reqBody)
            expect(result).toMatchObject(reqBody)
        })

        test("should throw an error with product does not exists", async () => {
            const service = new CatalogService(repository);

            jest
                .spyOn(repository, "update")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("product does not exist"))
                );

            await expect(service.updateProduct({})).rejects.toThrow(
                "product does not exist"
            )
        })
    })

    describe("getProducts", () => {
        test("should get products by offset and limit", async () => {
            const service = new CatalogService(repository);
            const randomLimit = faker.number.int({ min: 1, max: 100 });

            const products = productFactory.buildList(randomLimit);

            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() => Promise.resolve(products));

            const result = await service.getProducts(randomLimit, 0);
            console.log(result);

            expect(result.length).toEqual(randomLimit);
            expect(result).toMatchObject(products);
        })

        test("should throw an error with product does not exist", async () => {
            const service = new CatalogService(repository);

            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("product does not exist"))
                );

            await expect(service.getProducts(10, 0)).rejects.toThrow(
                "product does not exist"
            )
        })
    })

    describe("getProduct", () => {
        test("should get product by id", async () => {
            const service = new CatalogService(repository);
            const product = productFactory.build();

            jest
                .spyOn(repository, "findOne")
                .mockImplementationOnce(() => Promise.resolve(product));

            const result = await service.getProduct(product.id!);
            console.log(result);

            expect(result).toMatchObject(product);
        })
    })

    describe("deleteProduct", () => {
        test("should delete product by id", async () => {
            const service = new CatalogService(repository);
            const product = productFactory.build();

            jest
                .spyOn(repository, "delete")
                .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

            const result = await service.deleteProduct(product.id!);
            console.log(result);

            expect(result).toMatchObject({
                id: product.id
            });
        })
    })

})