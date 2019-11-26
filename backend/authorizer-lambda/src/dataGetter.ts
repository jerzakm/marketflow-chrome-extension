import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import moment from 'moment'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'test'
  }
}

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJhbGxlZ3JvX2FwaSJdLCJleHAiOjE1NzQ4NDIwMjYsImp0aSI6ImQ2MTViMDBlLWYwNDYtNGFiMC1hYzk1LTdiZDA1MDRiYTUyYyIsImNsaWVudF9pZCI6ImM4ZjlhYjQ1MDU4ZDQ1M2FhYmZiNGZlMzczYWE1MjEyIn0.e5bHN7msky - huzvzHi2TsiU7KZoxAb22STu9o8l5Fe5jXh7SxfwO6_eCdhm1XFQketweMrB3QHDKZwBdZ_OcqEpcq9axQo75FWRaAv1NE9DSXnMvJ_9BtfcuzpJcnuyWI0CHsVxcILGJl - m4MgHmiAsCVG0dV3mhhtuWMp2tLwVb0g5IkeLacGQmu - G6tjXa24l1vygvBJ7P4VhRcccKdtUXARkijVkzSEiRDLfDP5fl8D1clnxeqlU2AzBaA3FVeJ - gvP6NHz3kHyvVAKOnf5iwx3aWkjdVTqOIXAHpuK3YglUCTOoh4DEaPuRCZAvUt9lMzOqmQ1lhsL8NghcdMw'
