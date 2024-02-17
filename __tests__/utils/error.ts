import {CreateBlogModel} from "../../src/features/blogs/models/input/CreateBlogModel";
import {ErrorMessage} from "../../src/utils/errors";

export const errors = {
    async errors(data: CreateBlogModel,
                 expectedErrorsMessages?: ErrorMessage) {
        let errorMessage = data;
        expect(errorMessage).toEqual({
            errorsMessages: expectedErrorsMessages
        })

        return errorMessage;
    }
}