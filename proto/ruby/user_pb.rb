# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: user.proto

require 'google/protobuf'

Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "types.User" do
    optional :id, :string, 1
    optional :first_name, :string, 2
    optional :last_name, :string, 3
    optional :email, :string, 4
  end
  add_message "types.CreateUserRequest" do
    optional :user, :message, 1, "types.User"
  end
  add_message "types.CreateUserResponse" do
    optional :id, :int32, 1
    optional :success, :bool, 2
  end
end

module Types
  User = Google::Protobuf::DescriptorPool.generated_pool.lookup("types.User").msgclass
  CreateUserRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("types.CreateUserRequest").msgclass
  CreateUserResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("types.CreateUserResponse").msgclass
end
